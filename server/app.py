import datetime
import os
import json
import uuid
import sqlite3
from dataclasses import dataclass
#from dotenv import load_dotenv
from flask import Flask, send_from_directory, jsonify, request,Response, redirect, session
#load_dotenv()

@dataclass
class Player:
    #maybe add image like emoji flags or something
    username: str
    score: float
    date: str

key = uuid.uuid4().hex
app = Flask(__name__)
app.secret_key = key


#set default route to svelte frontend
@app.route('/')
def root():
    #session["isPlayer"] = True
    return send_from_directory('../frontend/dist', 'index.html')
 
@app.route('/game')
def game():
    session["isPlayer"] = True
    return send_from_directory('../frontend/dist', 'game.html')

@app.route('/leaderboard')
def lb():
    session["isPlayer"] = True
    return send_from_directory('../frontend/dist', 'leaderboard.html')


# get static assests
@app.route("/<path:path>")
def base(path):
    return send_from_directory('../frontend/dist/', path)


"""
    DB functions
"""

def get_leaderboard() -> list:
    sql_statement = "SELECT * FROM players ORDER BY score DESC;"
    try:
        conn = sqlite3.connect('shout.db')
        cur = conn.cursor()
        cur.execute(sql_statement)
        #list of tuples
        players = cur.fetchall()
        res = []
        for player in players:
            uname = player[2]
            score = player[3]
            date = player[1]
            p = Player(uname, score, date)
            res.append( p )
        conn.close()
        return res
    except:
        return []

    
def insert_player(username, score) -> bool:
    try: 
        conn = sqlite3.connect('shout.db')
        cur = conn.cursor()
        cur.execute("INSERT INTO players (username, score) VALUES (?, ?)",
            (username, score)
        )
        conn.commit()
        conn.close()
        return True
    except:
        return False


"""
    GET apis
"""
@app.route("/api/leaderboard", methods=['GET'])
def get_lb():
    res = get_leaderboard()
    return jsonify(res)


""" 
    POST apis
"""
def valid_score(score:int) -> bool:
    if score > 10000000 or score < 0:
        return False
    return True

@app.route('/api/saveScore', methods=['POST'])
def saveScore():
    """
    Save player scores
    """
    data = request.json
    try:
        username = data.get('username')
        #check if player played game and session created
        if "isPlayer" in session:
            score = int(data.get('score'))
            if not valid_score(score):
                return "hmm interesting score..."
            if insert_player(username, score) == True:
                return "GG", 200
            else:
                return "DB whoops!", 504
        else:
            return "Nope", 500
    except:
        return "none valid input", 500

    
if __name__ == '__main__':
    app.run(debug=True)