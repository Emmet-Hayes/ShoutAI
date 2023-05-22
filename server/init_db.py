'''
This file seeds Database
'''

import datetime
import random
from dataclasses import dataclass
import sqlite3
 
@dataclass
class Player:
    #maybe add image like emoji flags or something
    username: str
    score: float
    date: str

try:
    # connect to the database
    conn = sqlite3.connect('shout.db')
    print("Database connection is established successfully!")
    
    with open('schema.sql') as f:
        conn.executescript(f.read())

    cur = conn.cursor()
    usernames = ["Bender Bending Rodríguez", "vader", "mathis","square pants", "CSteam4","Rick","morty","user666","derp123","Philip J. Fry","Leela","Homer","Bart"]
    for x in usernames:
        uname = x
        score = random.randint(15000,30000)
        cur.execute("INSERT INTO players (username, score) VALUES (?, ?)",
                (uname, score)
                )

    conn.commit()
  
finally: conn.close()



