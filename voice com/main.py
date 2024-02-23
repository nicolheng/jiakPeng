import voice
import datetime
from pydub import AudioSegment
from pydub.playback import play
from insertFood import *
from os import remove
import sqlite3

try:
    con = sqlite3.connect("directory.db")
    cur = con.cursor()
except sqlite3.Error as error:
    print("Error for database", error)

wake_word = "hello fridge"
today = datetime.date.today()
month = {"01":"January", "02":"February", "03":"March", "04":"April", "05":"May", "06":"June", "07":"July", "08":"August", "09":"September","10":"October", "11":"November", "12":"December"}

def insertFood():

    #take photo
    image = takePic() #1st attempt

    if image == False: 
        voice.speak("retrying")
        image = takePic() #2nd attempt

        if image == False: 
            voice.speak("sorry, please try again")
            return None

    #ask for name
    name = askName()
    if name == False:
        voice.speak("retrying")
        name = askName()

        if name == False:
            voice.speak("sorry, please try again")
            return None
    
    #ask for date 
    date = askDate()
    if date == False:
        voice.speak("retrying")
        date = askDate()

        if date == False:
            voice.speak("sorry, please try again")
            return None
    
    #ask for quantity
    quantity = askQuantity()
    if quantity == False:
        voice.speak("retrying")
        quantity = askQuantity()

        if quantity == False:
            voice.speak("sorry, please try again")
            return None

    #insert
    cur.execute("INSERT INTO DIRECTORY (foodName, foodExpDate, foodPhoto, foodQuantity, foodAddDate) VALUES(?,?,?,?,?)",(name,date,image,quantity,today))
    con.commit()
    voice.speak("Insert success. You can check the record in our web app")
    remove("voice com/temp.jpg")

def expDate():
    #sql select, process into human form language, return result
    today = datetime.date.today()
    end = today + datetime.timedelta(days=6)
    print(today,end)

    foodList = cur.execute("""SELECT foodQuantity, foodName, foodExpDate FROM DIRECTORY 
                        WHERE CAST(strftime('%s', foodExpDate)AS integer) BETWEEN CAST(strftime('%s',?)AS integer) AND CAST(strftime('%s',?)as integer)  
                        ORDER BY strftime('%s',foodExpDate) ASC""",(today,end))
    for row in foodList:
        quantity = row[0]
        name = row[1]
        date = row[2]
        dateList = date.split("-")
        dateText = dateList[2]+" "+month[dateList[1]]+" "+dateList[0]

        text = str(quantity)+" "+name+" is expiring on "+dateText
        text = str(text)
        print(text)
        voice.speak(text)

    voice.speak("That's all. Please check the food directory for more detail")
    return None

def runVoice():
    audio = voice.capture_voice_input()
    text = voice.convert_voice_to_text(audio)

    if ("expire" in text.lower()) or ("expiring" in text.lower()) or ("expiry" in text.lower()): #expiring food
        expDate()

    elif ("insert" in text.lower()) or ("key in" in text.lower()) or ("add" in text.lower()): #insert new food
        insertFood()

    elif text == "are you a girl or a boy":
        voice.speak("No! I'm a fridge")

    else:
        voice.speak("I didn't understand that command. Please try again.")
    play(AudioSegment.from_wav("voice com/sound/siri_exit.wav"))
    voice.flag = False

def main():
    while True:
        audio = voice.capture_voice_input()
        text = voice.convert_voice_to_text(audio)

        if text.count(wake_word)>0:
            play(AudioSegment.from_wav("voice com/sound/siri_activate.wav"))
            voice.speak("Hi, How can I help you?")
            voice.flag = True
            runVoice()


if __name__ == "__main__":
    main()