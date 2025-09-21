# Hindi Text-to-Speech Web Application

A full-stack web application for converting Hindi text to speech using React frontend and FastAPI backend.

## Features

- **Hindi Text-to-Speech**: Convert Hindi text to audio using Google Text-to-Speech (gTTS)
- **Voice Selection**: Choose between Male and Female voice options (future-ready for different TTS services)
- **Clean UI**: Modern, responsive interface with Hindi language support
- **Audio Player**: Built-in audio player with download functionality
- **File Management**: Custom filename support and temporary audio storage
- **Future-Ready**: Designed for easy integration with Azure TTS or other premium TTS services

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for Python APIs
- **gTTS**: Google Text-to-Speech for audio generation
- **CORS Middleware**: For frontend-backend communication
- **Python-multipart**: For handling form data

### Frontend
- **React**: Modern JavaScript library for UI
- **Axios**: HTTP client for API communication
- **Modern CSS**: Responsive design with gradient backgrounds
- **Audio API**: Native HTML5 audio controls

## Project Structure

```
tts-webapp/
│
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── voices/               # Generated audio files storage
│
└── frontend/
    ├── package.json          # Node.js dependencies
    ├── public/
    │   ├── index.html
    │   └── manifest.json
    └── src/
        ├── App.js            # Main React component
        ├── App.css           # Application styles
        ├── index.js          # React entry point
        ├── index.css         # Global styles
        ├── api.js            # API service functions
        └── components/
            ├── TextInput.js   # Hindi text input component
            ├── VoiceSelect.js # Voice selection component
            └── AudioPlayer.js # Audio playback component
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd tts-webapp/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   python app.py
   ```
   Or using uvicorn directly:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000 --reload
   ```

The backend will be available at: `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd tts-webapp/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will be available at: `http://localhost:3000`

## Usage

1. **Start both servers**: Ensure both backend (port 8000) and frontend (port 3000) are running
2. **Open the application**: Navigate to `http://localhost:3000` in your browser
3. **Enter Hindi text**: Type or paste Hindi text in the text area
4. **Select voice**: Choose between Male or Female voice (currently both use gTTS)
5. **Set filename**: Enter a custom filename for your audio file
6. **Generate audio**: Click the "ऑडियो जेनरेट करें" button
7. **Play and download**: Use the audio player to listen and download the generated MP3

## API Endpoints

### POST `/generate-audio/`
Generate audio from Hindi text
- **Parameters**: `text` (string), `voice` (Male/Female), `filename` (string)
- **Returns**: MP3 audio file
- **Content-Type**: `multipart/form-data`

### GET `/`
Health check endpoint
- **Returns**: Server status message

### GET `/voices/`
List all generated voice files
- **Returns**: Array of voice file information

### DELETE `/voices/{filename}`
Delete a specific voice file
- **Parameters**: `filename` (string)
- **Returns**: Success message

## Future Enhancements

- **Azure TTS Integration**: Replace gTTS with Azure Cognitive Services for better voice quality
- **Multiple Voice Options**: Add different male and female voice varieties
- **Language Support**: Extend to other Indian languages
- **Voice Speed Control**: Add playback speed options
- **Batch Processing**: Convert multiple texts at once
- **User Authentication**: Add user accounts and history
- **Cloud Storage**: Store audio files in cloud storage services

## Development Notes

- The application uses gTTS which provides robotic-sounding voices
- Voice selection (Male/Female) is implemented for future TTS service integration
- CORS is configured to allow requests from the React development server
- Audio files are temporarily stored in the `voices/` directory
- The frontend includes comprehensive error handling and user feedback
- All UI text is provided in both Hindi and English for accessibility

## Troubleshooting

1. **Backend not starting**: Ensure Python 3.7+ is installed and all dependencies are installed
2. **Frontend not connecting**: Verify the backend is running on port 8000
3. **Audio not playing**: Check browser audio permissions and file download settings
4. **gTTS errors**: Ensure internet connection is available for Google TTS service

## License

This project is open source and available under the MIT License.