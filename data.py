""" database access
docs:
* http://initd.org/psycopg/docs/
* http://initd.org/psycopg/docs/pool.html
* http://initd.org/psycopg/docs/extras.html#dictionary-like-cursor
"""
# Source: Daniel Kluver

from contextlib import contextmanager
from dotenv import find_dotenv, load_dotenv
from flask import current_app
import logging
import os
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extras import DictCursor

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

pool = None


def setup():
    global pool
    DATABASE_URL = os.environ['DATABASE_URL']
    current_app.logger.info(f"creating db connection pool")
    pool = ThreadedConnectionPool(1, 100, dsn=DATABASE_URL, sslmode='require')


@contextmanager
def get_db_connection():
    try:
        connection = pool.getconn()
        yield connection
    finally:
        pool.putconn(connection)


@contextmanager
def get_db_cursor(commit=False):
    with get_db_connection() as connection:
        cursor = connection.cursor(cursor_factory=DictCursor)
        # cursor = connection.cursor()
        try:
            yield cursor
            if commit:
                connection.commit()
        finally:
            cursor.close()


def create_user_account(username, email):
    with get_db_cursor(True) as cur:
        current_app.logger.info("Adding user account %s", username)
        cur.execute("INSERT INTO users (username, email) values (%s, %s)",
                    (username, email))


def check_user_exists(email):
    with get_db_cursor() as cur:
        cur.execute("SELECT username FROM users WHERE email = %s", (email,))
        return cur.fetchone()


def create_house(house_name):
    with get_db_cursor(True) as cur:
        cur.execute("INSERT INTO houses (house_name) VALUES (%s)", (house_name,))


def check_house_exists(house_name):
    with get_db_cursor() as cur:
        cur.execute("SELECT * FROM houses WHERE house_name = %s", (house_name,))
        return cur.fetchone()


def get_houses():
    with get_db_cursor() as cur:
        cur.execute("SELECT house_name, house_id FROM houses")
        return cur.fetchall()
    
def get_user_id(user_email):
    with get_db_cursor() as cur:
        cur.execute("SELECT id FROM users WHERE email = %s", (user_email,))
        return cur.fetchone()

def get_user_houses(user_id):
    with get_db_cursor() as cur:
        cur.execute("SELECT house_name, house_id FROM user_houses LEFT JOIN houses USING (house_id) WHERE user_id = %s", (user_id,))
        return cur.fetchall()
    
def add_user_house(user_id, house_id):
    with get_db_cursor(True) as cur:
        cur.execute("INSERT INTO user_houses (user_id, house_id) VALUES (%s, %s)", (user_id, house_id))

def remove_user_house(user_id, house_id):
    with get_db_cursor(True) as cur:
        cur.execute("DELETE FROM user_houses WHERE user_id = %s AND house_id = %s", (user_id, house_id))

# get users' names given a house id
def get_house_members(house_id):
    with get_db_cursor() as cur:
        cur.execute(
            "SELECT u.username FROM users u JOIN user_houses uh ON u.id = uh.user_id WHERE uh.house_id = %s",
            (house_id,))
        members = cur.fetchall()
        return [member[0] for member in members] if members else ["No members"]
    
# for join button in user_home
def join_house(user_id, house_id):
    with get_db_cursor(True) as cur:
        cur.execute("INSERT INTO user_houses (user_id, house_id) VALUES (%s, %s)", (user_id, house_id))
