import React, { useState, useEffect } from 'react';
import TextInput from './components/TextInput';
import VoiceSelect from './components/VoiceSelect';
import AudioPlayer from './components/AudioPlayer';
import ttsApiService, { utils } from './api';
import './App.css';

function App() {
  // State management
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Male');
  const [filename, setFilename] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentFilename, setCurrentFilename] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [serverStatus, setServerStatus] = useState(null);

  // Check server status on component mount
  useEffect(() => {
    checkServerHealth();
  }, []);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        utils.revokeAudioUrl(audioUrl);
      }
    };
  }, [audioUrl]);

  const checkServerHealth = async () => {
    try {
      const isHealthy = await ttsApiService.checkServerHealth();
      setServerStatus(isHealthy);
      if (!isHealthy) {
        setError('Backend server is not accessible. Please ensure the FastAPI server is running on port 8000.');
      }
    } catch (error) {
      setServerStatus(false);
      setError('Unable to connect to backend server.');
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleGenerateAudio = async () => {
    clearMessages();
    
    // Validate input
    const validation = utils.validateInput(text, voice, filename);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    setIsLoading(true);

    try {
      // Clean up previous audio URL
      if (audioUrl) {
        utils.revokeAudioUrl(audioUrl);
      }

      // Generate audio
      const audioBlob = await ttsApiService.generateAudio(text, voice, filename);
      
      // Create new audio URL
      const newAudioUrl = utils.createAudioUrl(audioBlob);
      const fullFilename = `${filename}_${voice.toLowerCase()}.mp3`;
      
      setAudioUrl(newAudioUrl);
      setCurrentFilename(fullFilename);
      setSuccess('ऑडियो सफलतापूर्वक जेनरेट हो गया!');

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAudio = () => {
    if (audioUrl) {
      utils.revokeAudioUrl(audioUrl);
      setAudioUrl(null);
      setCurrentFilename('');
    }
  };

  const handleReset = () => {
    setText('');
    setFilename('');
    setVoice('Male');
    handleCloseAudio();
    clearMessages();
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="app-header">
          <h1>हिंदी टेक्स्ट टू स्पीच</h1>
          <p>Hindi Text-to-Speech Generator</p>
          {serverStatus === false && (
            <div className="server-status error">
              ⚠️ Server not connected
              <button onClick={checkServerHealth} className="retry-button">
                Retry
              </button>
            </div>
          )}
          {serverStatus === true && (
            <div className="server-status success">
              ✅ Server connected
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="app-main">
          {/* Input Section */}
          <div className="input-section">
            <TextInput 
              text={text} 
              setText={setText} 
              placeholder="उदाहरण: नमस्कार! आज का दिन बहुत सुंदर है।"
            />
            
            <VoiceSelect 
              voice={voice} 
              setVoice={setVoice} 
            />

            <div className="filename-input-container">
              <label htmlFor="filename" className="input-label">
                फ़ाइल का नाम:
              </label>
              <input
                id="filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="my-hindi-audio"
                className="filename-input"
                maxLength={50}
              />
              <small className="filename-help">
                केवल नाम दर्ज करें, .mp3 extension अपने आप जोड़ दिया जाएगा
              </small>
            </div>

            {/* Action Buttons */}
            <div className="button-container">
              <button
                onClick={handleGenerateAudio}
                disabled={isLoading || !text.trim() || !filename.trim() || serverStatus === false}
                className="generate-button"
              >
                {isLoading ? '🔄 जेनरेट हो रहा है...' : '🎵 ऑडियो जेनरेट करें'}
              </button>
              
              <button
                onClick={handleReset}
                className="reset-button"
                disabled={isLoading}
              >
                🔄 रीसेट करें
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="message error-message">
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="message success-message">
              ✅ {success}
            </div>
          )}

          {/* Audio Player Section */}
          {audioUrl && (
            <div className="audio-section">
              <AudioPlayer 
                audioUrl={audioUrl}
                filename={currentFilename}
                onClose={handleCloseAudio}
              />
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>आपका ऑडियो तैयार किया जा रहा है...</p>
              <small>यह कुछ सेकंड लग सकता है</small>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p>
              💡 <strong>नोट:</strong> यह एप्लिकेशन Google Text-to-Speech (gTTS) का उपयोग करता है। 
              भविष्य में Azure TTS या अन्य सेवाओं के साथ बेहतर आवाज़ें जोड़ी जाएंगी।
            </p>
            <div className="tech-stack">
              <span>React</span> • <span>FastAPI</span> • <span>gTTS</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;