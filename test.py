import datetime
months = ["january", "february", "march", "april", "may", "june","july", "august", "september","october", "november", "december"]
days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
dayExt = ["rd", "th", "st", "nd"]

dateText = "30th"

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
print(date)

