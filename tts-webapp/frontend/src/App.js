import React, { useState, useEffect } from 'react';
import TextInput from './components/TextInput';
import VoiceSelect from './components/VoiceSelect';
import AudioPlayer from './components/AudioPlayer';
import { generateAudio, checkApiHealth } from './api';

function App() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Female');
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    // Check API health on component mount
    checkApiHealth()
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('disconnected'));
  }, []);

  const handleGenerate = async () => {
    // Validate inputs
    if (!text.trim()) {
      setError('कृपया हिंदी टेक्स्ट दर्ज करें / Please enter Hindi text');
      return;
    }

    if (!filename.trim()) {
      setError('कृपया फ़ाइल नाम दर्ज करें / Please enter filename');
      return;
    }

    setError('');
    setLoading(true);
    setAudioData(null);

    try {
      const result = await generateAudio(text, voice, filename);
      setAudioData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    console.log('Audio downloaded successfully');
  };

  const handleReset = () => {
    setText('');
    setFilename('');
    setAudioData(null);
    setError('');
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            🎵 हिंदी टेक्स्ट-टू-स्पीच
          </h1>
          <p style={styles.subtitle}>
            Hindi Text-to-Speech Web Application
          </p>
          <div style={styles.statusContainer}>
            <div style={{
              ...styles.statusIndicator,
              backgroundColor: apiStatus === 'connected' ? '#48bb78' : 
                              apiStatus === 'disconnected' ? '#f56565' : '#ed8936'
            }}>
              {apiStatus === 'connected' ? '🟢 API Connected' : 
               apiStatus === 'disconnected' ? '🔴 API Disconnected' : '🟡 Checking...'}
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div style={styles.form}>
          <TextInput
            value={text}
            onChange={setText}
            placeholder="उदाहरण: नमस्ते, मेरा नाम राम है। आज का दिन बहुत अच्छा है।"
          />

          <VoiceSelect
            value={voice}
            onChange={setVoice}
          />

          <div style={styles.filenameContainer}>
            <label style={styles.label}>
              फ़ाइल नाम / Filename *
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="my_hindi_audio"
              style={styles.filenameInput}
              disabled={loading}
            />
            <div style={styles.hint}>
              फ़ाइल एक्सटेंशन (.mp3) अपने आप जुड़ जाएगा
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actions}>
            <button
              onClick={handleGenerate}
              disabled={loading || !text.trim() || !filename.trim()}
              style={{
                ...styles.generateButton,
                ...(loading ? styles.generateButtonLoading : {}),
                ...((!text.trim() || !filename.trim()) ? styles.generateButtonDisabled : {})
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}>⏳</span>
                  ऑडियो बनाई जा रही है... / Generating Audio...
                </>
              ) : (
                <>
                  <span style={styles.generateIcon}>🎵</span>
                  ऑडियो बनाएं / Generate Audio
                </>
              )}
            </button>

            {audioData && (
              <button
                onClick={handleReset}
                style={styles.resetButton}
              >
                🔄 नया / New
              </button>
            )}
          </div>
        </div>

        {/* Audio Player */}
        {audioData && (
          <AudioPlayer
            audioUrl={audioData.audioUrl}
            filename={audioData.filename}
            onDownload={handleDownload}
          />
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerContent}>
            <h3 style={styles.footerTitle}>📖 उपयोग की जानकारी / How to Use</h3>
            <ol style={styles.steps}>
              <li>हिंदी टेक्स्ट टेक्स्ट एरिया में लिखें / Enter Hindi text in the text area</li>
              <li>आवाज़ का प्रकार चुनें (पुरुष/महिला) / Select voice type (Male/Female)</li>
              <li>फ़ाइल का नाम दर्ज करें / Enter filename</li>
              <li>"ऑडियो बनाएं" बटन पर क्लिक करें / Click "Generate Audio" button</li>
              <li>ऑडियो सुनें और डाउनलोड करें / Listen and download the audio</li>
            </ol>
            
            <div style={styles.techInfo}>
              <strong>तकनीकी जानकारी / Technical Info:</strong><br/>
              • Backend: FastAPI + gTTS<br/>
              • Frontend: React<br/>
              • Language: Hindi (हिंदी)<br/>
              • Format: MP3<br/>
              • Future Ready: Easy integration with Azure TTS or other APIs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
    color: 'white',
    padding: '40px 30px',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '32px',
    fontWeight: '700',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  subtitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    opacity: '0.9',
    fontWeight: '400',
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  statusIndicator: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white',
  },
  form: {
    padding: '40px 30px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '16px',
  },
  filenameContainer: {
    marginBottom: '20px',
  },
  filenameInput: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  hint: {
    marginTop: '6px',
    fontSize: '14px',
    color: '#718096',
    fontStyle: 'italic',
  },
  error: {
    background: '#fed7d7',
    color: '#c53030',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #feb2b2',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  generateButton: {
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)',
    minWidth: '200px',
    justifyContent: 'center',
  },
  generateButtonLoading: {
    background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
    cursor: 'not-allowed',
  },
  generateButtonDisabled: {
    background: '#a0aec0',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  generateIcon: {
    fontSize: '20px',
  },
  spinner: {
    fontSize: '20px',
    animation: 'spin 1s linear infinite',
  },
  resetButton: {
    background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)',
  },
  footer: {
    background: '#f7fafc',
    borderTop: '1px solid #e2e8f0',
    padding: '30px',
  },
  footerContent: {
    maxWidth: '100%',
  },
  footerTitle: {
    margin: '0 0 16px 0',
    color: '#2d3748',
    fontSize: '20px',
    fontWeight: '600',
  },
  steps: {
    marginBottom: '20px',
    color: '#4a5568',
    lineHeight: '1.6',
    paddingLeft: '20px',
  },
  techInfo: {
    background: '#edf2f7',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#2d3748',
    lineHeight: '1.5',
    border: '1px solid #e2e8f0',
  },
};

// Add keyframes for spinner animation
const spinKeyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = spinKeyframes;
  document.head.appendChild(styleSheet);
}

export default App;