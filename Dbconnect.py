import sqlite3
try:
    con = sqlite3.connect("directory.db")
    cur = con.cursor()
except sqlite3.Error as error:
    print("Error for database", error)