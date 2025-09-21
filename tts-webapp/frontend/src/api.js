import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for audio generation
});

export const generateAudio = async (text, voice, filename) => {
  try {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('voice', voice);
    formData.append('filename', filename);

    const response = await api.post('/generate-audio/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob', // Important for handling audio file
    });

    // Create a blob URL for the audio file
    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return {
      audioUrl,
      filename: `${filename}_${voice.toLowerCase()}.mp3`,
      blob: audioBlob
    };
  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error(
      error.response?.data?.detail || 
      'Failed to generate audio. Please try again.'
    );
  }
};

export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};