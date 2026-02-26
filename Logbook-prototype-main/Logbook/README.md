# Logbook System (Flask + Firebase)

Cloud-based logbook web app for students and teachers using Firebase Firestore.

Setup

1. **Create Firebase Project** (one-time)
   - Go to https://console.firebase.google.com
   - Click "Create Project", follow the wizard
   - Create a Firestore database (choose test mode for development)
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file as `firebase-key.json` in this folder (`C:\Logbook\`)

2. **Install dependencies and run**

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
py -3 -m pip install --upgrade pip
py -3 -m pip install -r requirements.txt
py -3 app.py
```

Or using one-liner:

```powershell
py -3 -m venv .venv; .\.venv\Scripts\Activate.ps1; py -3 -m pip install -r requirements.txt; py -3 app.py
```

3. Open http://127.0.0.1:5000 in your browser.

Usage

- Click "New Entry" to log an activity.
- Enter name, student ID, year/department, and select an activity.
- If you select "Others", an additional text field appears for custom activity description.
- Click "View All Entries" to see all logged entries (stored in Firebase Firestore).

Files

- `app.py` — Flask app with Firestore integration
- `firebase-key.json` — Service account credentials (keep secure, don't commit to git)
- `requirements.txt` — Python dependencies
- `templates/` — HTML templates
- `static/` — JavaScript and CSS

Important

- **`firebase-key.json` must be in the project folder** for the app to connect to Firebase
- Keep this file **private** — never commit it to public repositories
- Replace `app.secret_key` with a secure random value before production use
- Entries are stored in Firebase Firestore (cloud) and accessible from anywhere

