from flask import Flask, render_template, request, redirect, url_for, flash, Response
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os
import pytz
import csv
from io import StringIO

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CRED_PATH = os.path.join(BASE_DIR, 'firebase-key.json')

app = Flask(__name__)
app.secret_key = 'replace-this-with-a-secure-random-key'

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(CRED_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Philippine timezone
PHT = pytz.timezone('Asia/Manila')

@app.template_filter('pht_datetime')
def pht_datetime_filter(timestamp_str):
    """Convert ISO timestamp to Philippine Time and format it"""
    try:
        # Parse the ISO timestamp
        dt = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
        
        # Convert to Philippine Time
        if dt.tzinfo is None:
            dt = pytz.utc.localize(dt)
        
        pht_dt = dt.astimezone(PHT)
        
        # Format: "02/25/2026 03:25 PM"
        return pht_dt.strftime('%m/%d/%Y %I:%M %p')
    except:
        return timestamp_str

@app.route('/')
def index():
    return redirect(url_for('entry'))

@app.route('/entry', methods=['GET', 'POST'])
def entry():
    activities = ['Study', 'Lab', 'Meeting', 'Library', 'Others']
    if request.method == 'POST':
        name = request.form.get('name')
        student_id = request.form.get('student_id')
        year_dept = request.form.get('year_dept')
        department_office = request.form.get('department_office')
        activity = request.form.get('activity')
        activity_other = request.form.get('activity_other') or None
        
        # Get current time in Philippine Time
        timestamp = datetime.now(PHT).isoformat()
        
        # Save to Firestore
        db.collection('entries').add({
            'name': name,
            'student_id': student_id,
            'year_dept': year_dept,
            'department_office': department_office,
            'activity': activity,
            'activity_other': activity_other,
            'timestamp': timestamp
        })
        
        flash('Entry recorded successfully!')
        return redirect(url_for('entries'))
    return render_template('entry_form.html', activities=activities)

@app.route('/entries')
def entries():
    # Fetch all entries from Firestore, ordered by timestamp descending
    docs = db.collection('entries').order_by('timestamp', direction=firestore.Query.DESCENDING).stream()
    entries = []
    for doc in docs:
        entry_data = doc.to_dict()
        entry_data['id'] = doc.id
        
        # Format timestamp to readable format
        if 'timestamp' in entry_data:
            try:
                dt = datetime.fromisoformat(entry_data['timestamp'].replace('Z', '+00:00'))
                if dt.tzinfo is None:
                    dt = pytz.utc.localize(dt)
                pht_dt = dt.astimezone(PHT)
                entry_data['timestamp'] = pht_dt.strftime('%m/%d/%Y %I:%M %p')
            except:
                pass
        
        # Format timein if it exists
        if 'timein' in entry_data:
            try:
                time_obj = datetime.strptime(entry_data['timein'], '%H:%M:%S')
                entry_data['timein'] = time_obj.strftime('%I:%M %p')
            except:
                try:
                    time_obj = datetime.strptime(entry_data['timein'], '%H:%M')
                    entry_data['timein'] = time_obj.strftime('%I:%M %p')
                except:
                    pass
        
        entries.append(entry_data)
    return render_template('entries.html', entries=entries)

@app.route('/export-csv')
def export_csv():
    # Fetch all entries from Firestore, ordered by timestamp descending
    docs = db.collection('entries').order_by('timestamp', direction=firestore.Query.DESCENDING).stream()
    
    # Create CSV in memory
    si = StringIO()
    writer = csv.writer(si)
    
    # Write header
    writer.writerow(['Name', 'Student ID', 'Year/Dept', 'Dept/Office', 'Activity', 'Activity (Other)', 'Time In', 'Timestamp (PHT)'])
    
    # Write data rows
    for doc in docs:
        entry_data = doc.to_dict()
        
        # Format timestamp
        timestamp_formatted = ''
        if 'timestamp' in entry_data:
            try:
                dt = datetime.fromisoformat(entry_data['timestamp'].replace('Z', '+00:00'))
                if dt.tzinfo is None:
                    dt = pytz.utc.localize(dt)
                pht_dt = dt.astimezone(PHT)
                timestamp_formatted = pht_dt.strftime('%m/%d/%Y %I:%M %p')
            except:
                timestamp_formatted = entry_data.get('timestamp', '')

        # Format timein
        timein_formatted = ''
        if 'timein' in entry_data:
            try:
                time_obj = datetime.strptime(entry_data['timein'], '%H:%M:%S')
                timein_formatted = time_obj.strftime('%I:%M %p')
            except:
                try:
                    time_obj = datetime.strptime(entry_data['timein'], '%H:%M')
                    timein_formatted = time_obj.strftime('%I:%M %p')
                except:
                    timein_formatted = entry_data.get('timein', '')

        writer.writerow([
            entry_data.get('name', ''),
            entry_data.get('student_id', ''),
            entry_data.get('year_dept', ''),
            entry_data.get('department_office', '-'),
            entry_data.get('activity', ''),
            entry_data.get('activity_other', '-'),
            timein_formatted,
            timestamp_formatted
        ])
    
    # Create response
    output = si.getvalue()
    si.close()
    
    return Response(
        output,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=logbook_entries.csv'}
    )

if __name__ == '__main__':
    app.run(debug=True)
