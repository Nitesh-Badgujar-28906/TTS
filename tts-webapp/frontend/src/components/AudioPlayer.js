import React, { useRef, useEffect } from 'react';

const AudioPlayer = ({ audioUrl, filename, onDownload }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  const handleDownload = () => {
    if (audioUrl && filename) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (onDownload) {
        onDownload();
      }
    }
  };

  if (!audioUrl) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          🎧 ऑडियो प्लेयर / Audio Player
        </h3>
        <div style={styles.filename}>
          📁 {filename}
        </div>
      </div>
      
      <div style={styles.playerContainer}>
        <audio
          ref={audioRef}
          controls
          style={styles.audioPlayer}
          preload="metadata"
        >
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      
      <div style={styles.actions}>
        <button
          onClick={handleDownload}
          style={styles.downloadButton}
          title="Download audio file"
        >
          <span style={styles.downloadIcon}>⬇️</span>
          डाउनलोड करें / Download
        </button>
      </div>
      
      <div style={styles.info}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>प्रारूप / Format:</span>
          <span style={styles.infoValue}>MP3</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>भाषा / Language:</span>
          <span style={styles.infoValue}>हिंदी / Hindi</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#2d3748',
    fontSize: '20px',
    fontWeight: '600',
  },
  filename: {
    color: '#4a5568',
    fontSize: '14px',
    fontFamily: 'monospace',
    background: '#ffffff',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    display: 'inline-block',
  },
  playerContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  audioPlayer: {
    width: '100%',
    maxWidth: '400px',
    height: '40px',
    outline: 'none',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  downloadButton: {
    background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(66, 153, 225, 0.2)',
  },
  downloadIcon: {
    fontSize: '18px',
  },
  info: {
    display: 'flex',
    justify: 'space-between',
    gap: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: '12px',
    color: '#718096',
    marginBottom: '4px',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '14px',
    color: '#2d3748',
    fontWeight: '600',
  },
};

// Add hover effect for download button
const hoverStyles = `
  button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3) !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = hoverStyles;
  document.head.appendChild(styleSheet);
}

export default AudioPlayer;