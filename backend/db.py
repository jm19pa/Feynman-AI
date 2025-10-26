import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

load_dotenv("/etc/env")

'''print("=== ENV DEBUG ===")
print("DB_HOST:", os.getenv("DB_HOST"))
print("DB_USER:", os.getenv("DB_USER"))
print("DB_PASSWORD:", os.getenv("DB_PASSWORD"))
print("DB_NAME:", os.getenv("DB_NAME"))
print("=================")'''

def connect_to_database():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        if conn.is_connected():
            print("Connected to database")
            return conn
    except Exception as e:
        print(f" Error connecting to database: {e}")
        return None


def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD")
        )
        if connection.is_connected():
            return connection
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None
    

def query(sql, params=None):
    """
    Run a SELECT query and return all results as a list of dictionaries.
    Example: query('SELECT * FROM users WHERE id=%s', (1,))
    """

    conn = None
    cursor = None
    
    try:

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(sql, params or ())
        results = cursor.fetchall()
        return results
    except Exception as e:
        print(f"Query Error: {e}")
        return []
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def execute(sql, params=None):
    """
    Run an INSERT, UPDATE, or DELETE query.
    Example: execute('INSERT INTO users (name) VALUES (%s)', ('Alice',))
    """

    conn = None
    cursor = None
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(sql, params or ())
        conn.commit()
        lastRowID = cursor.lastrowid
        return lastRowID
    except Exception as e:
        print(f"Execute Error: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()