import axios from 'axios';

// Detect Codespaces domain and construct backend URL accordingly
const detectApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  const { host, protocol } = window.location;
  const isCodespaces = /\.app\.github\.dev$/.test(host);

  if (isCodespaces) {
    // Prefer computed Codespaces URL unless an explicit non-localhost env URL is provided
    if (!envUrl || /localhost|127\.0\.0\.1/.test(envUrl)) {
      const backendHost = host.replace(/-3000\./, '-8001.');
      return `${protocol}//${backendHost}`;
    }
    return envUrl;
  }

  // Non-Codespaces: use env if set, otherwise default to localhost
  return envUrl || 'http://localhost:8001';
};

const API_BASE_URL = detectApiBaseUrl();
console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for audio generation
  headers: { 'Content-Type': 'application/json' },
});

// API service class
class TTSApiService {
  /**
   * Generate audio from Hindi text
   * @param {string} text - Hindi text to convert to speech
   * @param {string} voice - Voice type (Male/Female)
   * @param {string} filename - Output filename without extension
   * @returns {Promise<Blob>} - Audio blob
   */
  async generateAudio(text, voice, filename) {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('text', text);
      formData.append('voice', voice);
      formData.append('filename', filename);

      // Make request to generate audio
      const response = await api.post('/generate-audio/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Important for receiving binary data
      });

      return response.data;
    } catch (error) {
      console.error('Error generating audio:', error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.detail || 'Server error occurred';
        throw new Error(`Server Error: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network Error: Unable to connect to server. Please check if the backend is running.');
      } else {
        // Something else happened
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }

  /**
   * Check if the backend server is running
   * @returns {Promise<boolean>} - True if server is accessible
   */
  async checkServerHealth() {
    try {
      const response = await api.get('/');
      console.log('Health check response:', response.data);
      return response.status === 200;
    } catch (error) {
      console.error('Server health check failed:', error);
      if (error.code === 'ECONNREFUSED') {
        console.error('Connection refused - Backend server is not running on', API_BASE_URL);
      }
      return false;
    }
  }

  /**
   * Get list of generated voice files
   * @returns {Promise<Array>} - List of voice files
   */
  async getVoiceFiles() {
    try {
      const response = await api.get('/voices/');
      return response.data.voices;
    } catch (error) {
      console.error('Error fetching voice files:', error);
      throw new Error('Unable to fetch voice files');
    }
  }

  /**
   * Delete a specific voice file
   * @param {string} filename - Name of the file to delete
   * @returns {Promise<string>} - Success message
   */
  async deleteVoiceFile(filename) {
    try {
      const response = await api.delete(`/voices/${filename}`);
      return response.data.message;
    } catch (error) {
      console.error('Error deleting voice file:', error);
      throw new Error('Unable to delete voice file');
    }
  }
}

// Utility functions
export const utils = {
  /**
   * Create a blob URL from audio blob
   * @param {Blob} audioBlob - Audio blob
   * @returns {string} - Blob URL
   */
  createAudioUrl: (audioBlob) => {
    return URL.createObjectURL(audioBlob);
  },

  /**
   * Clean up blob URL
   * @param {string} url - Blob URL to revoke
   */
  revokeAudioUrl: (url) => {
    URL.revokeObjectURL(url);
  },

  /**
   * Validate Hindi text input
   * @param {string} text - Text to validate
   * @returns {Object} - Validation result
   */
  validateInput: (text, voice, filename) => {
    const errors = [];

    // Validate text
    if (!text || text.trim().length === 0) {
      errors.push('कृपया कुछ टेक्स्ट दर्ज करें');
    } else if (text.length > 5000) {
      errors.push('टेक्स्ट 5000 अक्षरों से कम होना चाहिए');
    }

    // Validate voice
    if (!voice || !['Male', 'Female'].includes(voice)) {
      errors.push('कृपया आवाज़ का चयन करें');
    }

    // Validate filename
    if (!filename || filename.trim().length === 0) {
      errors.push('कृपया फ़ाइल का नाम दर्ज करें');
    } else if (filename.length > 50) {
      errors.push('फ़ाइल नाम 50 अक्षरों से कम होना चाहिए');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Format file size in human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted size
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

// Create and export service instance
const ttsApiService = new TTSApiService();
export default ttsApiService;