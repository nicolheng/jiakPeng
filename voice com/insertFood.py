import datetime
import voice
import cv2

months = ["january", "february", "march", "april", "may", "june","july", "august", "september","october", "november", "december"]
days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
dayExt = ["rd", "th", "st", "nd"]
number = {'one':1,'two':2,'three':3,'tree':3,'four':4,'five':5,'six':6,'seven':7,'eight':8,'nine':9,'ten':10}

def convertToBinaryData(filename):
    with open(filename, 'rb') as file:
        blobData = file.read()
    return blobData

def takePic():
    voice.speak("Taking photo. Please place the food in the front of the camera")
    cam = cv2.VideoCapture(0)
    result, image = cam.read()

    cv2.imwrite("voice com/temp.jpg",image)
    if result:
        print("photo success")
        image = convertToBinaryData("voice com/temp.jpg")
        voice.speak("Photo is taken")
        return image
    else:
        print("camera problem occur")
        voice.speak("An error occured")
        return False
    
    
def askName():
    voice.speak("What's the name of the food?")
    audio = voice.capture_voice_input()
    name = voice.convert_voice_to_text(audio)
    if name != "":
        voice.speak("Alright")
        return name
    else:
        voice.speak("An error occured")
        return False

def getDate(dateText):
    today = datetime.date.today()
    day = -1
    dayOfWeek = -1
    month = today.month
    next = False
    year = today.year

    if "today" in dateText: #today
        date = datetime.date.today()

    elif "tomorrow" in dateText: #tomorrow
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

def askDate():

    voice.speak("What's the expire date of the food?")
    audio = voice.capture_voice_input()
    dateText = voice.convert_voice_to_text(audio).lower()
    if dateText != "":
        try:
            date = getDate(dateText)
            voice.speak("Alright")
            return date
        except:
            print("text to date prob")
            voice.speak("An error occured")
            return False
    else:
        voice.speak("An error occured")
        return False

    
def askQuantity():

    voice.speak("What's the quantity of the food?")
    audio = voice.capture_voice_input()
    quantity = voice.convert_voice_to_text(audio)
    
    try:
        if quantity in number.keys():
            quantity = number[quantity]
        else:
            quantity = eval(quantity)
        voice.speak("Alright")
        return quantity
    except:
        voice.speak("an error occured")
        return False