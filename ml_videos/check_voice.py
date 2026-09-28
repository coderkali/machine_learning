import os
from dotenv import load_dotenv
load_dotenv(".env")
from elevenlabs import set_api_key, generate, voices
set_api_key(os.environ["ELEVENLABS_API_KEY"])
print("VOICE NAME IN .env:", os.environ.get("ELEVEN_VOICE_NAME"))
try:
    print("VOICES:", [v.name for v in voices()][:10])
except Exception as e:
    print("VOICES ERROR:", repr(e))
try:
    a = generate(text="Hello", voice=os.environ.get("ELEVEN_VOICE_NAME"))
    print("TTS OK, bytes:", len(a))
except Exception as e:
    print("TTS ERROR:", repr(e))
