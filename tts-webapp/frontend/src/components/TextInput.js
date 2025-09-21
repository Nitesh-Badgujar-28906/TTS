import React from 'react';

const TextInput = ({ text, setText, placeholder = "यहाँ अपना हिंदी टेक्स्ट लिखें..." }) => {
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="text-input-container">
      <label htmlFor="hindi-text" className="input-label">
        हिंदी टेक्स्ट दर्ज करें:
      </label>
      <textarea
        id="hindi-text"
        value={text}
        onChange={handleTextChange}
        placeholder={placeholder}
        className="text-area"
        rows={6}
        cols={50}
        maxLength={5000}
      />
      <div className="character-count">
        {text.length}/5000 characters
      </div>
    </div>
  );
};

export default TextInput;