import voice
import Dbconnect

def main():
    while True:
        audio = voice.capture_voice_input()
        text = voice.convert_voice_to_text(audio)
        if "hello fridge" not in text.lower():
            continue
        result = process_voice_command(text)
        voice.speak(result)


if __name__ == "__main__":
    main()

def process_voice_command(text):
    if "hello fridge" in text.lower():
        result = "Hello! How can I help you?"
    else:
        result = "I didn't understand that command. Please try again."
    return result