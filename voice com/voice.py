#import
import speech_recognition as sr
import pyttsx3
from pydub import AudioSegment
from pydub.playback import play

#tts initialize
engine = pyttsx3.init('sapi5')
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[1].id)
recognizer = sr.Recognizer()
flag = False

def speak(audio):
    engine.say(audio)
    engine.runAndWait()

def capture_voice_input ():
    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
    return audio

def convert_voice_to_text (audio):
    try:
        text = recognizer.recognize_google(audio)
        print("You said: " + text)
    except sr.UnknownValueError:
        text = ""
        print("Sorry, I didn't understand that.")
    except sr.RequestError as e:
        text = ""
        print("Error; {0}".format(e))
    finally:
        if flag == True:
            play(AudioSegment.from_wav("sound/siri_reactivate.wav"))
    return text