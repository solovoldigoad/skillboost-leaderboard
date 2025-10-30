from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import csv
import os
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # allow Vite frontend access

# --- Load Environment Variables ---
load_dotenv()

# --- MongoDB Setup ---
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)

# --- Check Database Connection ---
try:
    client.admin.command('ping')
    print("✅ MongoDB connection successful.")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
# ---------------------------------

db = client['student_leaderboard']  # Database name
students_collection = db['students']   # Collection name
# ---------------------

# +++ Add a root route for health checks +++
@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "Hello! This is the SkillBoost Leaderboard API."})

def get_badge_count(url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            badge_links = soup.find_all('a', href=lambda x: bool(x) and 'badges' in str(x).lower())
            return len(badge_links)
        else:
            print(f"Error fetching {url}: Status code {response.status_code}")
            return -1  # Return -1 or 0 to indicate an error
    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")
        return -1

def _perform_data_refresh():
    """
    Core logic to read student.csv, scrape profile data, and update the MongoDB collection.
    This function is called by both the scheduler and the API endpoint.
    """
    with app.app_context(): # Ensure we have application context for logging etc.
        print("🚀 Starting hourly data refresh...")
        try:
            # Construct the full path to the CSV file
            current_dir = os.path.dirname(os.path.abspath(__file__))
            csv_path = os.path.join(current_dir, 'student.csv')

            with open(csv_path, 'r') as file:
                csv_reader = csv.DictReader(file)
                for student in csv_reader:
                    name = student['User Name']
                    url = student['Google Cloud Skills Boost Profile URL']
                    badge_count = get_badge_count(url)

                    # Use update_one with upsert=True to insert or update the student data
                    students_collection.update_one(
                        {'profile_url': url},  # Use the URL as a unique identifier
                        {'$set': {'name': name, 'badges': badge_count, 'profile_url': url}},
                        upsert=True
                    )
            print("✅ Hourly data refresh completed successfully.")
        except Exception as e:
            print(f"❌ Error during scheduled data refresh: {e}")

@app.route('/api/students/refresh', methods=['POST'])
def refresh_students_data():
    """
    API endpoint to manually trigger a data refresh.
    """
    try:
        _perform_data_refresh()
        return jsonify({"message": "Student data refreshed successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/students', methods=['GET'])
def get_students():
    """
    Fetches student data directly from the MongoDB database.
    """
    try:
        students_cursor = students_collection.find({}, {'_id': 0})  # Exclude the default _id field
        students_data = list(students_cursor)
        return jsonify(students_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # --- Scheduler Setup ---
    scheduler = BackgroundScheduler()
    # Schedule the job to run every hour, and also immediately at startup
    scheduler.add_job(func=_perform_data_refresh, trigger="interval", hours=1, id='refresh_job')
    scheduler.start()
    print("🕒 Job scheduler started. Data will refresh every hour.")

    # Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown())
    # ---------------------
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
