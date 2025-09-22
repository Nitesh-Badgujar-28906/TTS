import streamlit as st
import os
import tempfile
import time
import random
from gtts import gTTS
from gtts.tts import gTTSError
import base64
from io import BytesIO

@st.cache_data(show_spinner=False, ttl=3600)
def _synthesize_bytes(text: str, tld: str = "com", slow: bool = False) -> bytes:
    """Call gTTS and return MP3 bytes; cached to avoid repeated API hits for same input."""
    tts = gTTS(text=text, lang='hi', tld=tld, slow=slow)
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_file:
        tts.save(tmp_file.name)
        with open(tmp_file.name, 'rb') as audio_file:
            audio_bytes = audio_file.read()
    os.unlink(tmp_file.name)
    return audio_bytes


def text_to_speech(text, voice_type, filename, *, retries: int = 5, base_delay: float = 0.8):
    """
    Convert Hindi text to speech using gTTS and save as mp3 file.
    Adds retries with exponential backoff and rotates Google TLDs to mitigate 429s.
    """
    # Create filename with voice type
    audio_filename = f"{filename}_{voice_type.lower()}.mp3"

    # Rotate among multiple TLDs to distribute requests
    tld_pool = ["com", "co.in", "com.au", "co.uk"]

    # Randomize start to avoid thundering herd on a single TLD
    start_idx = random.randrange(len(tld_pool))

    last_error = None
    for attempt in range(retries):
        tld = tld_pool[(start_idx + attempt) % len(tld_pool)]
        try:
            audio_bytes = _synthesize_bytes(text=text, tld=tld, slow=False)
            # Success
            return audio_bytes, audio_filename
        except Exception as e:  # Catch gTTSError and any transient network errors
            last_error = e
            message = str(e)
            is_rate_limited = isinstance(e, gTTSError) and ("429" in message or "Too Many Requests" in message)
            # Some environments surface HTTP errors as generic Exceptions; check message too
            is_rate_limited = is_rate_limited or ("429" in message or "Too Many Requests" in message)

            if attempt < retries - 1:
                # Exponential backoff with jitter
                delay = base_delay * (1.6 ** attempt) + random.uniform(0, 0.4)
                # Inform user non-intrusively
                st.info(f"Retrying TTS (attempt {attempt + 2}/{retries})… switching region tld={tld!s} in ~{delay:.1f}s")
                time.sleep(delay)
                continue
            else:
                # Final failure: provide actionable guidance
                if is_rate_limited:
                    st.error("Error generating speech: 429 (Too Many Requests) from TTS API. Please wait 1–2 minutes and try again, or reduce request frequency. If this persists, try a different network or deploy the app on a server.")
                else:
                    st.error(f"Error generating speech: {message}")
                return None, None

def get_audio_download_link(audio_bytes, filename):
    """
    Generate download link for audio file
    """
    b64_audio = base64.b64encode(audio_bytes).decode()
    href = f'<a href="data:audio/mp3;base64,{b64_audio}" download="{filename}">Download {filename}</a>'
    return href

def main():
    # Set page config
    st.set_page_config(
        page_title="Hindi Text to Speech Converter",
        page_icon="🎤",
        layout="wide"
    )
    
    # Main title
    st.title("🎤 Hindi Text to Speech Converter")
    st.markdown("Convert Hindi text to speech and download as MP3 file")
    
    # Create columns for better layout
    col1, col2 = st.columns([2, 1])
    
    with col1:
        # Text area for Hindi text input
        st.subheader("📝 Enter Hindi Text")
        hindi_text = st.text_area(
            "Paste your Hindi text here:",
            height=200,
            placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें...",
            help="Enter the Hindi text you want to convert to speech"
        )
    
    with col2:
        st.subheader("⚙️ Settings")
        
        # Voice type selection
        voice_type = st.radio(
            "Select Voice Type:",
            options=["Male", "Female"],
            index=1,  # Default to Female
            help="Choose the voice type for the audio (Note: gTTS uses the same voice, but filename will reflect your choice)"
        )
        
        # Filename input
        filename = st.text_input(
            "Enter filename (without extension):",
            value="hindi_audio",
            help="Enter the desired filename for your audio file"
        )
        
        # Validate filename
        if filename:
            # Remove any invalid characters
            filename = "".join(c for c in filename if c.isalnum() or c in (' ', '-', '_')).rstrip()
            if not filename:
                filename = "hindi_audio"
    
    # Center the generate button
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 1, 1])
    
    with col2:
        generate_button = st.button(
            "🎵 Generate Audio",
            type="primary",
            use_container_width=True
        )
    
    # Process when button is clicked
    if generate_button:
        if hindi_text.strip():
            with st.spinner("🔄 Generating audio... Please wait..."):
                # Generate audio
                audio_bytes, audio_filename = text_to_speech(hindi_text, voice_type, filename)
                
                if audio_bytes:
                    st.success("✅ Audio generated successfully!")
                    
                    # Create two columns for audio player and download
                    audio_col1, audio_col2 = st.columns(2)
                    
                    with audio_col1:
                        st.subheader("🎧 Audio Player")
                        st.audio(audio_bytes, format='audio/mp3')
                    
                    with audio_col2:
                        st.subheader("⬇️ Download")
                        st.markdown(
                            get_audio_download_link(audio_bytes, audio_filename),
                            unsafe_allow_html=True
                        )
                        
                        # Also provide a direct download button
                        st.download_button(
                            label=f"📥 Download {audio_filename}",
                            data=audio_bytes,
                            file_name=audio_filename,
                            mime="audio/mp3",
                            use_container_width=True
                        )
                    
                    # Display file info
                    st.info(f"📋 **File Details:**\n- Filename: `{audio_filename}`\n- Voice Type: {voice_type}\n- Language: Hindi")
                
        else:
            st.error("⚠️ Please enter some Hindi text to convert to speech!")
    
    # Footer with instructions
    st.markdown("---")
    st.markdown("""
    ### 📖 How to use:
    1. **Enter Hindi Text**: Paste or type your Hindi text in the text area
    2. **Select Voice**: Choose between Male or Female voice type
    3. **Set Filename**: Enter a custom filename (without extension)
    4. **Generate**: Click the "Generate Audio" button
    5. **Listen & Download**: Use the audio player to listen and download the MP3 file
    
    ### 💡 Tips:
    - The app supports Devanagari script (हिंदी)
    - Audio files are saved in MP3 format
    - Filename will include the selected voice type
    - Currently using Google Text-to-Speech (gTTS) for voice generation
    """)
    
    # Sidebar with additional info
    with st.sidebar:
        st.header("ℹ️ About")
        st.write("""
        This app converts Hindi text to speech using Google's Text-to-Speech (gTTS) service.
        
        **Features:**
        - Hindi text input support
        - Voice type selection
        - Custom filename
        - Audio playback
        - MP3 download
        """)
        
        st.header("🛠️ Technical Details")
        st.write("""
        **Technologies used:**
        - Streamlit (Web interface)
        - gTTS (Text-to-speech)
        - Python 3.x
        
        **Supported Language:**
        - Hindi (हिंदी)
        """)

if __name__ == "__main__":
    main()