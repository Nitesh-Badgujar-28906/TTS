import React from 'react';

const VoiceSelect = ({ voice, setVoice }) => {
  const handleVoiceChange = (e) => {
    setVoice(e.target.value);
  };

  return (
    <div className="voice-select-container">
      <label className="input-label">
        आवाज़ चुनें:
      </label>
      <div className="voice-options">
        <div className="radio-option">
          <input
            type="radio"
            id="male"
            name="voice"
            value="Male"
            checked={voice === 'Male'}
            onChange={handleVoiceChange}
          />
          <label htmlFor="male" className="radio-label">
            पुरुष आवाज़ (Male)
          </label>
        </div>
        <div className="radio-option">
          <input
            type="radio"
            id="female"
            name="voice"
            value="Female"
            checked={voice === 'Female'}
            onChange={handleVoiceChange}
          />
          <label htmlFor="female" className="radio-label">
            महिला आवाज़ (Female)
          </label>
        </div>
      </div>
      <div className="voice-note">
        <small>
          नोट: वर्तमान में दोनों विकल्प समान आवाज़ का उपयोग करते हैं। भविष्य में अलग आवाज़ें उपलब्ध होंगी।
        </small>
      </div>
    </div>
  );
};

export default VoiceSelect;