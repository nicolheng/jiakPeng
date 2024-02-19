from flask import *
import sqlite3
import cv2
import datetime
from PIL import Image, ImageTk
from io import BytesIO

app = Flask(__name__)
try:
    con = sqlite3.connect("directory.db")
    cur = con.cursor()
except sqlite3.Error as error:
    print("Error for database", error)
    
@app.route('/')
def index(): 
    connect = sqlite3.connect('directory.db') 
    cursor = connect.cursor() 
    cursor.execute('SELECT foodID, foodName, foodQuantity, foodExpDate, foodAddDate, foodPhoto FROM DIRECTORY ORDER BY CASE WHEN strftime("%s",foodExpDate) < strftime("%s",DATE()) then 1 else 0 END,  strftime("%s",foodExpDate) ASC') 
    
    dateCheck = datetime.date.today() + datetime.timedelta(days=7)
    data = cursor.fetchall() 
    return render_template("index.html",len=len(data), data=data, dateCheck = dateCheck, date_filter = date_filter, tdy = datetime.date.today(), showPic = showPic)

def date_filter(s):
    return datetime.datetime.strptime(s,'%Y-%m-%d').date()

def showPic(blob,id):
    with open("web app/static/img/"+str(id)+".jpg", 'wb') as file:
        file.write(blob)
        filename= "/img/"+str(id)+".jpg"
        return filename
    
@app.route('/add',methods=["POST"])   
def add_item():
    if request.method == "POST":
        today = datetime.date.today()
        name = request.form["foodName"]
        date = request.form["foodExpDate"]
        quantity = request.form["foodQuantity"]
        foodPhoto = request.form["foodPhoto"]

        #convert pic to blob
        cv2.imwrite("temp.png",foodPhoto)
        with open(foodPhoto, 'rb') as file:
            image = file.read()
        try:
            con = sqlite3.connect("directory.db")
            cur = con.cursor()
        except sqlite3.Error as error:
            print("Error for database", error)

        #insert
        cur.execute("INSERT INTO DIRECTORY (foodName, foodExpDate, foodPhoto, foodQuantity, foodAddDate) VALUES(?,?,?,?,?)",(name,date,image,quantity,today))
        con.commit()

        flash('Insert Success!')
    return redirect('/')


  
if __name__ == '__main__': 
    app.secret_key = 'super secret key'
    app.config['SESSION_TYPE'] = 'filesystem'

    app.run(debug = True) 