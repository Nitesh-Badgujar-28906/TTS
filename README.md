# Hindi Text-to-Speech Full-Stack Web Application

A complete full-stack web application for converting Hindi text to speech using React frontend and FastAPI backend.

![Hindi TTS Application](https://github.com/user-attachments/assets/5ad237cd-2017-4d75-9c7e-2d367db1209d)

## 🌟 Features

- **🎵 Hindi Text-to-Speech**: Convert Hindi text (Devanagari script) to MP3 audio
- **🎧 Audio Playback**: Built-in audio player for immediate playback
- **⬇️ Download Support**: Download generated audio files in MP3 format
- **🎯 Voice Selection**: Choose between Male/Female voice types
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **🌐 Real-time API**: FastAPI backend with CORS support
- **🚀 Future Ready**: Easy integration with Azure TTS or other premium TTS services

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for Python
- **gTTS**: Google Text-to-Speech library for Hindi TTS
- **CORS**: Cross-Origin Resource Sharing support
- **Uvicorn**: ASGI server for FastAPI

### Frontend
- **React**: Modern JavaScript library for building user interfaces
- **Axios**: HTTP client for API communication
- **Custom CSS**: Beautiful gradient designs and animations

## 📁 Project Structure

```
tts-webapp/
├── backend/
│   ├── app.py              # FastAPI application with TTS endpoints
│   ├── requirements.txt    # Python dependencies
│   └── voices/            # Generated audio files storage
└── frontend/
    ├── package.json       # React dependencies and scripts
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

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd tts-webapp/backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
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

## 📖 Usage Guide

1. **Enter Hindi Text**: Type or paste Hindi text in Devanagari script in the text area
2. **Select Voice**: Choose between Male (पुरुष) or Female (महिला) voice type
3. **Set Filename**: Enter a custom filename (without extension)
4. **Generate Audio**: Click the "ऑडियो बनाएं / Generate Audio" button
5. **Listen & Download**: Use the audio player to listen and download the MP3 file

### Example Hindi Text
```
नमस्ते! मेरा नाम राहुल है। आज का दिन बहुत सुंदर है।
यह हिंदी टेक्स्ट-टू-स्पीच एप्लिकेशन है।
```

## 🔧 API Endpoints

### POST `/generate-audio/`
Generates audio from Hindi text.

**Parameters:**
- `text` (string): Hindi text to convert to speech
- `voice` (string): Voice type ("Male" or "Female")
- `filename` (string): Desired filename without extension

**Response:** MP3 audio file as downloadable response

### GET `/health`
Health check endpoint to verify API status.

**Response:** `{"status": "healthy", "message": "API is running"}`

## 🏗️ Development Mode

The current implementation includes a **demo mode** for environments without internet access. To enable **production mode** with real TTS:

1. Ensure internet connectivity for Google TTS service
2. Uncomment the gTTS import in `backend/app.py`
3. Replace the `create_demo_mp3()` call with actual gTTS code:

```python
# Production code:
tts = gTTS(text=text, lang='hi', slow=False)
tts.save(str(audio_path))
```

## 🌐 Deployment

### Backend Deployment
- Deploy using Docker, Heroku, or any cloud platform
- Ensure environment has internet access for gTTS
- Set appropriate CORS origins for production

### Frontend Deployment
- Build for production: `npm run build`  
- Deploy to Netlify, Vercel, or any static hosting
- Update API_BASE_URL in production

## 🔮 Future Enhancements

- **Premium TTS Integration**: Azure Cognitive Services, AWS Polly
- **Multiple Indian Languages**: Telugu, Tamil, Bengali, etc.
- **Voice Customization**: Speed, pitch, tone controls
- **User Authentication**: Account management and file history
- **Batch Processing**: Multiple text-to-speech conversions
- **Advanced Audio Features**: Background music, effects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Google Text-to-Speech (gTTS) for Hindi TTS capabilities
- React community for excellent documentation and tools
- FastAPI for providing a modern Python web framework
- The Hindi language community for inspiration

---

**Made with ❤️ for the Hindi-speaking community**