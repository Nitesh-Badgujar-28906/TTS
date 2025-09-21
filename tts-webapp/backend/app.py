from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from gtts import gTTS
import os
import tempfile
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Hindi TTS API", description="Text-to-Speech API for Hindi language")

# Configure CORS
# In local dev, allow localhost:3000/3001. In Codespaces, allow any
# <random>-3000.app.github.dev or -3001.app.github.dev origin via regex.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_origin_regex=r"https://[a-z0-9-]+-(3000|3001)\.app\.github\.dev",
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Create voices directory if it doesn't exist
VOICES_DIR = Path("voices")
VOICES_DIR.mkdir(exist_ok=True)

@app.get("/")
async def root():
    """Health check endpoint with detailed status"""
    return {
        "message": "Hindi TTS API is running",
        "status": "healthy",
        "version": "1.0.0",
        "port": 8001,
        "endpoints": {
            "health": "/",
            "generate_audio": "/generate-audio/",
            "list_voices": "/voices/",
            "delete_voice": "/voices/{filename}",
            "docs": "/docs"
        }
    }

@app.post("/generate-audio/")
async def generate_audio(
    text: str = Form(..., description="Hindi text to convert to speech"),
    voice: str = Form(..., description="Voice type: Male or Female"),
    filename: str = Form(..., description="Output filename without extension")
):
    """
    Generate Hindi TTS audio file
    
    Args:
        text: Hindi text to convert to speech
        voice: Voice type (Male/Female) - currently both use gTTS
        filename: Output filename without extension
    
    Returns:
        Audio file as downloadable response
    """
    try:
        # Validate inputs
        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if voice.lower() not in ['male', 'female']:
            raise HTTPException(status_code=400, detail="Voice must be 'Male' or 'Female'")
        
        if not filename.strip():
            raise HTTPException(status_code=400, detail="Filename cannot be empty")
        
        # Clean filename to prevent path traversal and ensure safety
        safe_filename = "".join(c for c in filename if c.isalnum() or c in (' ', '-', '_')).rstrip()
        if not safe_filename:
            safe_filename = "audio"
        
        # Additional security: limit filename length and remove any potentially harmful characters
        safe_filename = safe_filename[:50]  # Limit to 50 characters
        
        # Create audio filename
        audio_filename = f"{safe_filename}_{voice.lower()}.mp3"
        audio_path = VOICES_DIR / audio_filename
        
        logger.info(f"Generating TTS for text: '{text[:50]}...' with voice: {voice}")
        
        # Generate TTS using gTTS
        # Note: gTTS doesn't have different male/female voices, but we keep the structure
        # for future integration with other TTS services like Azure TTS
        tts = gTTS(text=text, lang='hi', slow=False)
        
        # Save the audio file
        tts.save(str(audio_path))
        
        logger.info(f"Audio saved to: {audio_path}")
        
        # Return the audio file as downloadable response
        return FileResponse(
            path=str(audio_path),
            media_type='audio/mpeg',
            filename=audio_filename,
            headers={"Content-Disposition": f"attachment; filename={audio_filename}"}
        )
        
    except Exception as e:
        logger.error(f"Error generating audio: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating audio: {str(e)}")

@app.get("/voices/")
async def list_voices():
    """List all generated voice files"""
    try:
        voice_files = []
        for file_path in VOICES_DIR.glob("*.mp3"):
            voice_files.append({
                "filename": file_path.name,
                "size": file_path.stat().st_size,
                "created": file_path.stat().st_mtime
            })
        return {"voices": voice_files}
    except Exception as e:
        logger.error(f"Error listing voices: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error listing voices: {str(e)}")

@app.delete("/voices/{filename}")
async def delete_voice(filename: str):
    """Delete a specific voice file"""
    try:
        file_path = VOICES_DIR / filename
        if file_path.exists() and file_path.suffix == '.mp3':
            file_path.unlink()
            return {"message": f"Voice file {filename} deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Voice file not found")
    except Exception as e:
        logger.error(f"Error deleting voice: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting voice: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)