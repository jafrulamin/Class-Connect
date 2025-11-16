# CUNY Course Data Scraper & Firebase Import

This directory contains scripts to scrape CUNY course data and import it into Firebase Firestore.

## 📋 Overview

1. **Python Scraper** (`scrape_courses.py`) - Scrapes course data from CUNY Global Search
2. **Firebase Import Script** (`import_to_firebase.js`) - Imports the scraped data into Firestore

## 🚀 Step 1: Environment Setup

### Install Python Dependencies

```bash
# Navigate to the scripts directory
cd scripts

# Install required packages
pip install -r requirements.txt
```

Or install individually:
```bash
pip install requests beautifulsoup4 lxml
```

## 🔍 Step 2: Run the Scraper

```bash
# From the scripts directory
python scrape_courses.py
```

This will:
- Scrape course data from CUNY Global Search
- Save results to `cuny_courses.json`
- Display progress and summary

### Output Format

The scraper generates `cuny_courses.json` with this structure:

```json
[
  {
    "course_code": "CSC 101",
    "course_name": "Introduction to Computer Science",
    "college": "Baruch College",
    "credits": 3
  }
]
```

### ⚠️ Important Notes

1. **HTML Structure**: The scraper includes template selectors. You may need to inspect the actual CUNY Global Search HTML and adjust the selectors in `scrape_courses.py` based on the real page structure.

2. **Rate Limiting**: The script includes a 1-second delay between requests to be respectful to the server.

3. **Error Handling**: The script continues even if some requests fail, so you'll get partial data.

## 🔥 Step 3: Set Up Firebase Import

### Prerequisites

1. **Install Firebase Admin SDK**:
   ```bash
   npm install firebase-admin
   ```

2. **Get Service Account Key**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to **Project Settings** > **Service Accounts**
   - Click **Generate New Private Key**
   - Save the JSON file as `firebase-service-account.json` in the `scripts` directory

### Import to Firebase

```bash
# From the project root
node scripts/import_to_firebase.js
```

This will:
- Read `cuny_courses.json`
- Create/update documents in the `courses` Firestore collection
- Use batch writes for efficiency
- Display progress

## 📊 Step 4: Verify Firebase Structure

After importing, verify in Firebase Console:

1. Go to **Firestore Database**
2. Check the `courses` collection
3. Each document should have:
   - `course_code` (string)
   - `course_name` (string)
   - `college` (string)
   - `credits` (number)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

## 🔒 Step 5: Set Up Firestore Security Rules

Make sure your Firestore rules allow reading courses:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read courses
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write (via Admin SDK)
    }
    
    // ... your other rules
  }
}
```

## 🐛 Troubleshooting

### Scraper Issues

1. **No courses found**: 
   - Inspect the CUNY Global Search page HTML
   - Update the CSS selectors in `scrape_courses.py`
   - Check if the website structure has changed

2. **Connection errors**:
   - Check your internet connection
   - Verify the CUNY Global Search URL is accessible
   - The site might be blocking automated requests

### Firebase Import Issues

1. **Service account not found**:
   - Make sure `firebase-service-account.json` is in the `scripts` directory
   - Verify the file has valid JSON structure

2. **Permission errors**:
   - Check that your service account has Firestore write permissions
   - Verify the project ID matches your Firebase project

3. **Batch size errors**:
   - The script uses batches of 500 (Firestore limit)
   - If you get batch errors, reduce `BATCH_SIZE` in the script

## 📝 Next Steps

Once the data is imported:

1. Update your app to query the `courses` collection from Firestore
2. Replace mock data in `lib/data.ts` with real Firestore queries
3. Implement course search and filtering
4. Link selected courses to users in the `users` collection

## 📁 File Structure

```
scripts/
├── scrape_courses.py              # Python scraper script
├── requirements.txt               # Python dependencies
├── import_to_firebase.js          # Firebase import script
├── cuny_courses.json              # Generated course data (after running scraper)
├── firebase-service-account.json  # Firebase credentials (you need to add this)
└── SCRAPER_README.md              # This file
```

## 🤝 Team Workflow

1. **Data Scraper** (You):
   - Run `scrape_courses.py`
   - Verify `cuny_courses.json` is generated correctly
   - Share the JSON file with the team

2. **Firebase Setup** (Teammate):
   - Set up Firebase service account
   - Run `import_to_firebase.js`
   - Verify data in Firebase Console
   - Update Firestore security rules

3. **Integration** (Both):
   - Update app to use Firestore courses
   - Test course search and selection
   - Link courses to users

