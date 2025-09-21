import React from 'react';

const TextInput = ({ value, onChange, placeholder = "यहाँ हिंदी टेक्स्ट लिखें..." }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        हिंदी टेक्स्ट / Hindi Text *
      </label>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={styles.textarea}
        rows={6}
        required
      />
      <div style={styles.hint}>
        टिप: देवनागरी लिपि में हिंदी टेक्स्ट टाइप करें
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
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '120px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    lineHeight: '1.5',
  },
  hint: {
    marginTop: '6px',
    fontSize: '14px',
    color: '#718096',
    fontStyle: 'italic',
  },
};

// Add focus styles
const focusStyles = `
  textarea:focus {
    border-color: #4299e1 !important;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1) !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = focusStyles;
  document.head.appendChild(styleSheet);
}

export default TextInput;