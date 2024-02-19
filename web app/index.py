from flask import *
import sqlite3
import cv2
import datetime
import numpy as np

app = Flask(__name__)
    
@app.route('/')
def index(): 
    try:
        con = sqlite3.connect("directory.db")
        cur = con.cursor()
    except sqlite3.Error as error:
        print("Error for database", error)
    cur.execute('SELECT foodID, foodName, foodQuantity, foodExpDate, foodAddDate, foodPhoto FROM DIRECTORY ORDER BY CASE WHEN strftime("%s",foodExpDate) < strftime("%s",DATE()) then 1 else 0 END,  strftime("%s",foodExpDate) ASC') 
    
    dateCheck = datetime.date.today() + datetime.timedelta(days=7)
    data = cur.fetchall() 
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
        image = request.files["foodPhoto"]
        imageBlob = image.read()
        try:
            con = sqlite3.connect("directory.db")
            cur = con.cursor()
        except sqlite3.Error as error:
            print("Error for database", error)
        #insert
        cur.execute("INSERT INTO DIRECTORY (foodName, foodExpDate, foodPhoto, foodQuantity, foodAddDate) VALUES(?,?,?,?,?)",(name,date,imageBlob,quantity,today))
        con.commit()

        flash('Insert Success!')
    return redirect('/')

@app.route('/<int:id>',methods=["POST"])
def action(id):
    action = request.form["action"]
    if action == "delete":

        try:
            con = sqlite3.connect("directory.db")
            cur = con.cursor()
        except sqlite3.Error as error:
            print("Error for database", error)

        name = request.form["foodName"]
        cur.execute("DELETE FROM DIRECTORY where foodID = %d" %id)
        con.commit()
        flash(name+" is deleted successfully")
    else:

        try:
            con = sqlite3.connect("directory.db")
            cur = con.cursor()
        except sqlite3.Error as error:
            print("Error for database", error)
        
        name = request.form["foodName"]
        quantity = request.form["foodQuantity"]
        expDate = request.form["foodExpDate"]
        cur.execute("UPDATE DIRECTORY SET foodName= ?, foodQuantity = ?, foodExpDate = ? where foodID = %d" %id, (name,quantity,expDate))
        con.commit()
        flash(name+" is modified successfully")
    return redirect('/')


  
if __name__ == '__main__': 
    app.secret_key = 'super secret key'
    app.config['SESSION_TYPE'] = 'filesystem'

    app.run(debug = True) 