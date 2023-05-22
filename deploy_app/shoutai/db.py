"""OLD MYsql class that didn't comuincate 
    probably something to do with docker compose but I just wnat it to work easily
    so we can work on other functionality 
"""

import os
from dataclasses import dataclass
import mysql.connector

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Player:
    # maybe add image like emoji flags or something in the future
    username: str
    score: float
    date: str

#I know using root isn't great, but I couldn't find an easy way to create a shoutuser with limited access
class DBManager:
    def __init__(self, database="shout", host="mysql", user="root"):
        try: 
            self.connection = mysql.connector.connect(
                user=user,
                password=os.getenv("DB_PWD"),
                host=host,  # name of the mysql service as set in the docker compose file
                database=database,
                auth_plugin="mysql_native_password",
            )
            self.cursor = self.connection.cursor()
        except Exception as e:
            print(e)

    def populate_db(self):
        try:
            self.cursor.execute("DROP TABLE IF EXISTS Players")
            self.cursor.execute(
                "CREATE TABLE players (id INT AUTO_INCREMENT PRIMARY KEY,created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,username VARCHAR(300) NOT NULL,score INT UNSIGNED NOT NULL)"
            )

            insert = "INSERT INTO players (username, score) VALUES (%s, %d);"
            values = [
                ("Mathis", 5000),
                ("Vader", 4030),
                ("notMing", 20350),
                ("AllForOne", 6666),
                ("OneForAll", 5000),
            ]
            # could use loop if many doesn't work
            self.cursor.executemany(insert, values)
            self.connection.commit()
        except Exception as e:
            print(e)

    def get_players(self) -> list:
        try:
            self.cursor.execute("SELECT * FROM players ORDER BY score DESC;")
            data = self.cursor.fetchall()
            return data
        except Exception as e:
            print(e)
            return []

    def insert_player(self, pl: Player) -> bool:
        try:
            insert = "INSERT INTO players (username, score) VALUES (%s, %d)"
            player = (pl.username, pl.score)
            self.cursor.execute(insert, player)
            self.connection.commit()
            return True
        except Exception as e:
            print(e)
            return False
