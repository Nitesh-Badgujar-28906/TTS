#!/usr/bin/env python3
"""
Temporary CLI tool to convert Hindi text to MP3 using gTTS (default) or espeak (optional offline fallback).
- Accepts text via --text or a text file via --file
- Allows output filename via --out and voice label via --voice (Male/Female)
- Retries with exponential backoff and rotates TLDs to mitigate 429 rate limits
- Optional: specify a single TLD; add start delay; choose engine=gtts|espeak
"""
import argparse
import os
import sys
import time
import random
import tempfile
import shutil
import subprocess
from typing import Optional

from gtts import gTTS
from gtts.tts import gTTSError


def synthesize_gtts(text: str, *, retries: int = 5, base_delay: float = 0.8, tld: Optional[str] = None) -> bytes:
    tld_pool = ["com", "co.in", "com.au", "co.uk"] if not tld else [tld]
    start_idx = random.randrange(len(tld_pool)) if len(tld_pool) > 1 else 0
    last_error: Optional[Exception] = None
    for attempt in range(retries):
        tld = tld_pool[(start_idx + attempt) % len(tld_pool)]
        try:
            tts = gTTS(text=text, lang="hi", tld=tld, slow=False)
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
                tts.save(tmp.name)
                with open(tmp.name, "rb") as f:
                    data = f.read()
            os.unlink(tmp.name)
            return data
        except Exception as e:  # Catch gTTSError and other transient exceptions
            last_error = e
            msg = str(e)
            is_429 = isinstance(e, gTTSError) and ("429" in msg or "Too Many Requests" in msg)
            is_429 = is_429 or ("429" in msg or "Too Many Requests" in msg)
            if attempt < retries - 1:
                delay = base_delay * (1.6 ** attempt) + random.uniform(0, 0.4)
                print(f"[retry {attempt+1}/{retries-1}] {msg} | next tld={tld} in {delay:.1f}s", file=sys.stderr)
                time.sleep(delay)
                continue
            else:
                if is_429:
                    print("Error: 429 Too Many Requests from gTTS. Wait 1–2 minutes and try again.", file=sys.stderr)
                else:
                    print(f"Error: {msg}", file=sys.stderr)
                raise


def synthesize_espeak(text: str) -> bytes:
    """Best-effort offline fallback using espeak. Returns WAV bytes; convert to MP3 if ffmpeg is present in caller."""
    espeak = shutil.which("espeak") or shutil.which("espeak-ng")
    if not espeak:
        raise RuntimeError("espeak/espeak-ng not found. Install with: sudo apt-get update && sudo apt-get install -y espeak-ng")
    # Generate 16-bit mono WAV via espeak stdout
    cmd = [espeak, "-v", "hi", "-s", "160", "--stdout", text]
    try:
        wav_bytes = subprocess.check_output(cmd)
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"espeak failed: {e}")
    return wav_bytes


def main():
    parser = argparse.ArgumentParser(description="Hindi Text to Speech (temporary CLI)")
    src = parser.add_mutually_exclusive_group(required=True)
    src.add_argument("--text", help="Hindi text to convert")
    src.add_argument("--file", help="Path to a UTF-8 text file containing Hindi text")
    parser.add_argument("--voice", choices=["Male", "Female"], default="Female", help="Voice label to include in filename")
    parser.add_argument("--out", help="Output filename without extension (default: hindi_audio)")
    parser.add_argument("--engine", choices=["gtts", "espeak"], default="gtts", help="TTS engine to use (default: gtts)")
    parser.add_argument("--tld", help="Force a specific Google TLD for gTTS (e.g., com, co.in)")
    parser.add_argument("--retries", type=int, default=5, help="Retry attempts for gTTS (default: 5)")
    parser.add_argument("--base-delay", type=float, default=0.8, help="Base delay seconds for backoff (default: 0.8)")
    parser.add_argument("--start-delay", type=float, default=0.0, help="Initial delay before first attempt (seconds)")

    args = parser.parse_args()

    # Resolve text
    if args.text is not None:
        text = args.text
    else:
        if not os.path.exists(args.file):
            print(f"Input file not found: {args.file}", file=sys.stderr)
            sys.exit(2)
        with open(args.file, "r", encoding="utf-8") as f:
            text = f.read()

    text = text.strip()
    if not text:
        print("No text provided after trimming.", file=sys.stderr)
        sys.exit(2)

    # Sanitize output filename
    base_name = args.out or "hindi_audio"
    base_name = "".join(c for c in base_name if c.isalnum() or c in (" ", "-", "_")).rstrip()
    if not base_name:
        base_name = "hindi_audio"

    voice = args.voice
    # We'll finalize extension based on engine and conversion availability
    out_ext = ".mp3"
    out_name = f"{base_name}_{voice.lower()}{out_ext}"

    try:
        if args.start_delay > 0:
            print(f"Waiting {args.start_delay:.1f}s before starting…", file=sys.stderr)
            time.sleep(args.start_delay)

        print(f"Synthesizing using {args.engine}…", file=sys.stderr)
        if args.engine == "gtts":
            audio_bytes = synthesize_gtts(text, retries=args.retries, base_delay=args.base_delay, tld=args.tld)
            with open(out_name, "wb") as f:
                f.write(audio_bytes)
            size = os.path.getsize(out_name)
            print(f"Saved: {out_name} ({size} bytes)")
        else:
            wav_bytes = synthesize_espeak(text)
            ffmpeg = shutil.which("ffmpeg")
            if ffmpeg:
                # Convert WAV bytes to MP3 via ffmpeg
                with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as wtmp:
                    wtmp.write(wav_bytes)
                    wtmp_path = wtmp.name
                mp3_name = out_name
                cmd = [ffmpeg, "-y", "-i", wtmp_path, "-codec:a", "libmp3lame", "-q:a", "4", mp3_name]
                subprocess.check_call(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                os.unlink(wtmp_path)
                size = os.path.getsize(mp3_name)
                print(f"Saved: {mp3_name} ({size} bytes)")
            else:
                # Save WAV if ffmpeg not available
                out_name_wav = f"{base_name}_{voice.lower()}.wav"
                with open(out_name_wav, "wb") as f:
                    f.write(wav_bytes)
                size = os.path.getsize(out_name_wav)
                print(f"Saved: {out_name_wav} ({size} bytes) | Tip: install ffmpeg to get MP3 output.")
    except Exception:
        sys.exit(1)


if __name__ == "__main__":
    main()
