import React, { useRef, useEffect } from 'react';

const AudioPlayer = ({ audioUrl, filename, onClose }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = filename || 'hindi-audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!audioUrl) {
    return null;
  }

  return (
    <div className="audio-player-container">
      <div className="audio-player-header">
        <h3>जेनरेट किया गया ऑडियो</h3>
        {onClose && (
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        )}
      </div>
      
      <div className="audio-controls">
        <audio ref={audioRef} controls className="audio-element">
          <source src={audioUrl} type="audio/mpeg" />
          आपका ब्राउज़र ऑडियो एलिमेंट को सपोर्ट नहीं करता।
        </audio>
      </div>

      <div className="audio-actions">
        <button onClick={handleDownload} className="download-button">
          📥 डाउनलोड करें
        </button>
        <div className="filename-display">
          फ़ाइल: {filename}
        </div>
      </div>

      <div className="audio-info">
        <small>
          💡 टिप: ऑडियो प्लेयर का उपयोग करके सुनें या डाउनलोड बटन पर क्लिक करके फ़ाइल सेव करें।
        </small>
      </div>
    </div>
  );
};

export default AudioPlayer;