import React from 'react';

const VoiceSelect = ({ value, onChange }) => {
  const voices = [
    { id: 'Male', label: 'पुरुष आवाज़ / Male Voice', icon: '👨' },
    { id: 'Female', label: 'महिला आवाज़ / Female Voice', icon: '👩' }
  ];

  const handleChange = (voiceId) => {
    onChange(voiceId);
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        आवाज़ चुनें / Select Voice *
      </label>
      <div style={styles.radioGroup}>
        {voices.map((voice) => (
          <div
            key={voice.id}
            style={{
              ...styles.radioOption,
              ...(value === voice.id ? styles.radioOptionSelected : {})
            }}
            onClick={() => handleChange(voice.id)}
          >
            <input
              type="radio"
              id={voice.id}
              name="voice"
              value={voice.id}
              checked={value === voice.id}
              onChange={() => handleChange(voice.id)}
              style={styles.radioInput}
            />
            <label 
              htmlFor={voice.id} 
              style={styles.radioLabel}
            >
              <span style={styles.icon}>{voice.icon}</span>
              <span>{voice.label}</span>
            </label>
          </div>
        ))}
      </div>
      <div style={styles.hint}>
        नोट: वर्तमान में gTTS एक ही आवाज़ का उपयोग करता है, लेकिन फ़ाइल नाम में आपकी पसंद दिखेगी
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '12px',
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '16px',
  },
  radioGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  radioOption: {
    flex: 1,
    minWidth: '200px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
  },
  radioOptionSelected: {
    borderColor: '#4299e1',
    backgroundColor: '#ebf8ff',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(66, 153, 225, 0.15)',
  },
  radioInput: {
    margin: '0 12px 0 0',
    cursor: 'pointer',
  },
  radioLabel: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    fontWeight: '500',
    color: '#2d3748',
    margin: 0,
    flex: 1,
  },
  icon: {
    fontSize: '20px',
    marginRight: '8px',
  },
  hint: {
    marginTop: '8px',
    fontSize: '13px',
    color: '#718096',
    fontStyle: 'italic',
    lineHeight: '1.4',
  },
};

export default VoiceSelect;