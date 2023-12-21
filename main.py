import voice
import Dbconnect
import cv2
import os
import datetime

months = ["january", "february", "march", "april", "may", "june","july", "august", "september","october", "november", "december"]
days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
dayExt = ["rd", "th", "st", "nd"]

wake_word = "hello fridge"

def convertToBinaryData(filename):
    with open(filename, 'rb') as file:
        blobData = file.read()
    return blobData

def takePic():
    cam = cv2.VideoCapture(0)
    result, image = cam.read()
    if result:
        cv2.imwrite("temp.png",image)
        print("photo success")
    else:
        print("camera problem occur")

def getDate(dateText):
    today = datetime.date.today()
    day = -1
    dayOfWeek = -1
    month = today.month
    next = False
    year = today.year

    if "today" in dateText: #today
            date = datetime.date.today()

    elif "tommorrow" in dateText: #tommorrow
        date = datetime.date.today() + datetime.timedelta(days=1)

    else:

        #extract everything
        for word in dateText.split(" "):
            if word in months:
                month = months.index(word)+1
            elif word in days:
                dayOfWeek = days.index(word)
                if "next" in dateText:
                    next = True
            elif word.isdigit() and len(word) <=2:
                day = int(word)
            elif word.isdigit() and len(word) == 4:
                year = int(word)
            else:
                for ext in dayExt:
                    found = word.find(ext)
                    if found > 0:
                        try:
                            day = int(word[:found])
                        except:
                            pass
        
        #convert to datetime
        if dayOfWeek != -1:

            #find diff of weekday
            TdyDayOfWeek = today.weekday()
            diff = dayOfWeek-TdyDayOfWeek

            if diff < 0 : #nextweek
                diff+=7

            if next: #contain next
                diff+=7
            
            deltaDiff = datetime.timedelta(days=diff)


            #add diff 
            date = datetime.date.today() + deltaDiff

        else:

            #generate date
            date = datetime.date(year,month,day)
    return(date)

def expDate():
    ###sql select, process into human form language, return result
    return None

def insertFood():

    #take photo
    voice.speak("Taking photo. Please place the food in the front of the camera")
    takePic()

    if os.path.exists("temp.png"): #check if photo is taken
        voice.speak("photo is taken")
        image = convertToBinaryData("temp.png")

    else: #error occur
        voice.speak("sorry, an error has occur, please try again")
        return None

    #ask for name
    voice.speak("What's the name of the food?")
    audio = voice.capture_voice_input()
    name = voice.convert_voice_to_text(audio)

    #ask for date 

    voice.speak("What's the expire date of the food?")
    audio = voice.capture_voice_input()
    dateText = voice.convert_voice_to_text(audio)
    dateText = dateText.lower()
    date = getDate(dateText)

    #insert

    
    #ask for name and date, insert, return insert success



def runVoice():
    audio = voice.capture_voice_input()
    text = voice.convert_voice_to_text(audio)
    if ("expire" or "expiring") in text.lower(): #expiring food
        expDate()
        result = "expire food"
    elif ("insert" or "key in") in text.lower(): #insert new food
        insertFood()
        result = "food is inserted"
    else:
        result = "I didn't understand that command. Please try again."
    voice.speak(result)

def main():
    while True:
        audio = voice.capture_voice_input()
        text = voice.convert_voice_to_text(audio)

        if text.count(wake_word)>0:
            voice.speak("Hi, How can I help you?")
            runVoice()

if __name__ == "__main__":
    main()