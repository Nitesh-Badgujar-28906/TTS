# Hindi Text-to-Speech Web Application

A full-stack web application for converting Hindi text to speech using React frontend and FastAPI backend.

## Features

- 🎵 **Hindi Text-to-Speech**: Convert Hindi text to MP3 audio using Google Text-to-Speech (gTTS)
- 🎧 **Audio Playback**: Built-in audio player for immediate playback
- ⬇️ **Download Support**: Download generated audio files in MP3 format
- 🎯 **Voice Selection**: Choose between Male/Female voice types (filename reflects choice)
- 📱 **Responsive Design**: Clean, modern UI that works on all devices
- 🚀 **Future Ready**: Easy integration with Azure TTS or other premium TTS APIs

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for Python
- **gTTS**: Google Text-to-Speech library for Hindi TTS
- **CORS**: Cross-Origin Resource Sharing for frontend communication
- **Uvicorn**: ASGI server for FastAPI

### Frontend
- **React**: Modern JavaScript library for building user interfaces
- **Axios**: HTTP client for API communication
- **Modern CSS**: Custom styling with gradients and animations

## Project Structure

```
tts-webapp/
├── backend/
│   ├── app.py              # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── voices/            # Generated audio files storage
└── frontend/
    ├── package.json       # React dependencies
    ├── public/
    │   └── index.html     # HTML template
    └── src/
        ├── App.js         # Main React component
        ├── index.js       # React app entry point
        ├── api.js         # API communication utilities
        └── components/
            ├── TextInput.js    # Hindi text input component
            ├── VoiceSelect.js  # Voice selection component
            └── AudioPlayer.js  # Audio playback component
```

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd tts-webapp/backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:
```bash
python app.py
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd tts-webapp/frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend application will be available at `http://localhost:3000`

## API Endpoints

### POST `/generate-audio/`
Generates audio from Hindi text.

**Parameters:**
- `text` (string): Hindi text to convert to speech
- `voice` (string): Voice type ("Male" or "Female")
- `filename` (string): Desired filename without extension

**Response:**
- Returns MP3 audio file as downloadable response

### GET `/health`
Health check endpoint to verify API status.

## Usage

1. **Enter Hindi Text**: Type or paste Hindi text in Devanagari script
2. **Select Voice**: Choose between Male or Female voice type
3. **Set Filename**: Enter a custom filename (without extension)
4. **Generate Audio**: Click the "Generate Audio" button
5. **Listen & Download**: Use the audio player and download the MP3 file

## Example Hindi Text

```
नमस्ते, मेरा नाम राम है। आज का दिन बहुत अच्छा है।
यह एक हिंदी टेक्स्ट-टू-स्पीच एप्लिकेशन है।
```

## Future Enhancements

- Integration with Azure Cognitive Services for realistic voices
- Support for different Hindi dialects
- Voice speed and pitch control
- Batch text processing
- User authentication and file management
- Support for other Indian languages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please create an issue in the repository or contact the development team.