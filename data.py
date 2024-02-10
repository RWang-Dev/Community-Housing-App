""" database access
docs:
* http://initd.org/psycopg/docs/
* http://initd.org/psycopg/docs/pool.html
* http://initd.org/psycopg/docs/extras.html#dictionary-like-cursor
"""
# Source: Daniel Kluver

from contextlib import contextmanager
import logging
import os

from flask import current_app, g

import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extras import DictCursor

pool = None

def setup():
    global pool
    DATABASE_URL = 'postgres://rw_survey_db_user:IP4PmGx8oVwqaTDT3sxV5fERLKsbBs8v@dpg-cmol3nud3nmc739ma900-a.oregon-postgres.render.com/rw_survey_db'
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

def add_user_account(username, email, password_hash):
    with get_db_cursor(True) as cur:
        current_app.logger.info("Adding user account %s", username)
        cur.execute("INSERT INTO user_accounts (username, email, password_hash) values (%s, %s, %s)", (username, email, password_hash))

def check_user_exists(username, password):
    with get_db_cursor() as cur:
        cur.execute("SELECT password_hash FROM user_accounts WHERE username = %s", (username,))
        return cur.fetchone()