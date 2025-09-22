import streamlit as st
import asyncio
import edge_tts
import base64
from io import BytesIO

# Async TTS generation
async def synthesize_speech(text: str, voice: str) -> bytes:
    """Generate speech using Microsoft Edge TTS and return MP3 bytes."""
    mp3_stream = BytesIO()
    tts = edge_tts.Communicate(text, voice)
    async for chunk in tts.stream():
        if chunk["type"] == "audio":
            mp3_stream.write(chunk["data"])
    return mp3_stream.getvalue()


def get_audio_download_link(audio_bytes: bytes, filename: str) -> str:
    """Generate download link for audio file."""
    b64_audio = base64.b64encode(audio_bytes).decode()
    href = f'<a href="data:audio/mp3;base64,{b64_audio}" download="{filename}">Download {filename}</a>'
    return href


def main():
    st.set_page_config(
        page_title="Hindi Text to Speech Converter",
        page_icon="🎤",
        layout="wide"
    )

    # Main title
    st.title("🎤 Hindi Text to Speech Converter (Edge TTS)")
    st.markdown("Convert Hindi text to natural speech and download as MP3")

    # Layout
    col1, col2 = st.columns([2, 1])

    with col1:
        st.subheader("📝 Enter Hindi Text")
        hindi_text = st.text_area(
            "Paste your Hindi text here:",
            height=200,
            placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें...",
            help="Enter the Hindi text you want to convert to speech"
        )

    with col2:
        st.subheader("⚙️ Settings")

        # Voice type selection (Edge TTS supports these)
        voice_map = {
            "Female (Swara)": "hi-IN-SwaraNeural",
            "Male (Madhur)": "hi-IN-MadhurNeural"
        }
        voice_choice = st.radio(
            "Select Voice Type:",
            options=list(voice_map.keys()),
            index=0
        )
        voice = voice_map[voice_choice]

        filename = st.text_input(
            "Enter filename (without extension):",
            value="hindi_audio",
            help="Enter the desired filename for your audio file"
        )
        if not filename.strip():
            filename = "hindi_audio"
        audio_filename = f"{filename}_{voice_choice.replace(' ', '_')}.mp3"

    # Generate button
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 1, 1])
    with col2:
        generate_button = st.button(
            "🎵 Generate Audio",
            type="primary",
            use_container_width=True
        )

    if generate_button:
        if hindi_text.strip():
            with st.spinner("🔄 Generating audio... Please wait..."):
                try:
                    audio_bytes = asyncio.run(synthesize_speech(hindi_text, voice))
                    st.success("✅ Audio generated successfully!")

                    # Show player + download
                    audio_col1, audio_col2 = st.columns(2)

                    with audio_col1:
                        st.subheader("🎧 Audio Player")
                        st.audio(audio_bytes, format="audio/mp3")

                    with audio_col2:
                        st.subheader("⬇️ Download")
                        st.markdown(
                            get_audio_download_link(audio_bytes, audio_filename),
                            unsafe_allow_html=True
                        )
                        st.download_button(
                            label=f"📥 Download {audio_filename}",
                            data=audio_bytes,
                            file_name=audio_filename,
                            mime="audio/mp3",
                            use_container_width=True
                        )

                    # File info
                    st.info(f"📋 **File Details:**\n- Filename: `{audio_filename}`\n- Voice: {voice_choice}\n- Language: Hindi")

                except Exception as e:
                    st.error(f"❌ Error generating audio: {e}")
        else:
            st.error("⚠️ Please enter some Hindi text to convert to speech!")

    # Footer
    st.markdown("---")
    st.markdown("""
    ### 📖 How to use:
    1. **Enter Hindi Text** in the input box
    2. **Select Voice** (Male or Female)
    3. **Set Filename**
    4. Click **Generate Audio**
    5. Listen or download the generated MP3

    ### 💡 Tips:
    - Uses Microsoft Edge TTS (natural voices, free, no GPU needed)
    - Hindi Male/Female voices supported
    - Works in Codespaces / local machine
    """)

    with st.sidebar:
        st.header("ℹ️ About")
        st.write("""
        This app converts Hindi text to natural speech using **Microsoft Edge TTS**.
        
        **Features:**
        - Hindi text input support
        - Male & Female natural voices
        - Custom filename
        - Audio playback & download
        """)


if __name__ == "__main__":
    main()
