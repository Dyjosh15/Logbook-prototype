import sqlite3
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'logbook.db')

def ensure_schema(conn):
    cur = conn.cursor()
    cur.execute('''
    CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        student_id TEXT,
        year_dept TEXT,
        activity TEXT,
        activity_other TEXT,
        timestamp TEXT
    )
    ''')
    conn.commit()

def main():
    conn = sqlite3.connect(DB_PATH)
    ensure_schema(conn)
    cur = conn.cursor()

    # Create a sample demo entry
    name = 'Demo Student'
    student_id = 'CS001'
    year_dept = '1/CS'
    activity = 'Study'
    timestamp = datetime.utcnow().isoformat()

    cur.execute('INSERT INTO entries (name,student_id,year_dept,activity,activity_other,timestamp) VALUES (?,?,?,?,?,?)',
                (name, student_id, year_dept, activity, None, timestamp))
    conn.commit()
    conn.close()
    print('Created demo entry for student:', name, '(ID:', student_id, ')')

if __name__ == '__main__':
    main()
