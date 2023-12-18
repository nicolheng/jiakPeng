import sqlite3
try:
    con = sqlite3.connect("directory.db")
    cur = con.cursor()
    cur.execute("CREATE TABLE DIRECTORY(foodID INTEGER PRIMARY KEY, foodName TEXT, FoodExpDate DATETIME, foodPhoto BLOB)")
except sqlite3.Error as error:
    print("Error while creating a sqlite table", error)