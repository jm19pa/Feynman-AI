import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

def _require_credentials():
    if not all([DB_HOST, DB_NAME, DB_USER, DB_PASSWORD]):
        raise RuntimeError(
            "Database credentials not fully set. "
            "Check DB_HOST, DB_NAME, DB_USER, DB_PASSWORD environment variables."
        )

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to database: {e}")
        return None
    

def query(sql, params=None):
    """
    Run a SELECT query and return all results as a list of dictionaries.
    Example: query('SELECT * FROM users WHERE id=%s', (1,))
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(sql, params or ())
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results

def execute(sql, params=None):
    """
    Run an INSERT, UPDATE, or DELETE query.
    Example: execute('INSERT INTO users (name) VALUES (%s)', ('Alice',))
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(sql, params or ())
    conn.commit()
    cursor.close()
    conn.close()