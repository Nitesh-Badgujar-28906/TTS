from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from gtts import gTTS
import os
import tempfile
from pathlib import Path

app = FastAPI(title="Hindi Text-to-Speech API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure voices directory exists
VOICES_DIR = Path("voices")
VOICES_DIR.mkdir(exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Hindi Text-to-Speech API is running!"}

@app.post("/generate-audio/")
async def generate_audio(
    text: str = Form(..., description="Hindi text to convert to speech"),
    voice: str = Form(..., description="Voice type: Male or Female"),
    filename: str = Form(..., description="Filename without extension")
):
    """
    Generate audio from Hindi text using gTTS
    """
    try:
        # Validate inputs
        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if voice not in ["Male", "Female"]:
            raise HTTPException(status_code=400, detail="Voice must be 'Male' or 'Female'")
        
        if not filename.strip():
            raise HTTPException(status_code=400, detail="Filename cannot be empty")
        
        # Clean filename
        clean_filename = "".join(c for c in filename if c.isalnum() or c in (' ', '-', '_')).strip()
        if not clean_filename:
            clean_filename = "hindi_audio"
        
        # Create gTTS object for Hindi language
        tts = gTTS(text=text, lang='hi', slow=False)
        
        # Create filename with voice type
        audio_filename = f"{clean_filename}_{voice.lower()}.mp3"
        audio_path = VOICES_DIR / audio_filename
        
        # Save the audio file
        tts.save(str(audio_path))
        
        # Return the audio file
        return FileResponse(
            path=str(audio_path),
            media_type="audio/mpeg",
            filename=audio_filename,
            headers={"Content-Disposition": f"attachment; filename={audio_filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating audio: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)