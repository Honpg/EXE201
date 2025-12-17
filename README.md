# 🌊 Ocean A
AI-Powered Meeting Intelligence Platform  

Ocean AI is an end-to-end AI-powered platform that automates meeting transcription, analysis, and report generation. It integrates a Chrome extension, web dashboard, and AI services to capture meetings in real time and transform them into structured, actionable insights.

---

## 🚀 Features

- **Real-Time Transcription**  
  Accurate speech-to-text transcription during live meetings.

- **AI-Powered Meeting Analysis**
  - Speaker-based segmentation  
  - Time-interval breakdown  
  - Sentiment analysis using NLP  
  - General meeting summaries

- **Automated Report Generation**
  - Export reports in **PDF** and **DOCX**
  - Customizable formats for different stakeholders

- **Email Integration**
  - Automatically sends generated reports to meeting participants

- **AI Chat Bot**
  - use API Gemini key to auto answer user

---

## System Architecture

Ocean AI follows a modular, multi-service architecture:

- **Chrome Extension**: Captures meeting audio, screenshots, and metadata  
- **AI Backend (Python – Flask)**: Transcription processing, NLP, sentiment analysis, report generation  
- **Node Backend (Express)**: API management, authentication, database, email services  
- **Frontend (React + Vite)**: Dashboard for managing meetings and reports  


## What is the core concept or problem this project aims to solve?

Meetings often result in miscommunication, missed details, and inefficient post-meeting workflows. Here are the key problems that Blabber addresses:

- **Time-consuming manual transcription**: Writing meeting recaps, reports, and transcripts manually is time-intensive and prone to errors.
  
- **Missed critical points**: Important details are often overlooked or forgotten, especially in long or fast-paced meetings.

- **Lack of real-time insights**: Manually tracking speaker contributions, emotional tone, and key discussion points is challenging and inefficient.

- **Difficulty in large meetings**: Generating comprehensive recaps and transcripts for larger meetings, involving many attendees and speakers, can be overwhelming and prone to omissions.

Blabber solves these issues by automating transcription, report generation, and providing tools like sentiment analysis and screenshot capture to ensure that no critical information is missed and that meetings are documented efficiently and accurately.


# Ocean AI Chrome Extension - Local Setup Guide

## Project Directory Structure

- AI-backend/ – Python Flask-based backend for AI-related tasks.
- Ocean AI-frontend/ – React-based frontend for Blabber.
- google-meet-chrome-extension/ – Chrome extension for Google Meet integration.
- node_backend/ – Node.js Express backend.
- .gitignore – Files to ignore in version control.
- README.md – Setup guide and project documentation.

## Git Configuration

### .gitignore File

The project includes a comprehensive `.gitignore` file that excludes:

- **Python files**: `__pycache__/`, virtual environments (`env/`, `venv/`), build outputs
- **Node.js files**: `node_modules/`, log files, build outputs (`dist/`)
- **Environment files**: `.env` files containing sensitive information like API keys
- **IDE/Editor files**: `.vscode/`, `.idea/`, editor temporary files
- **Operating System files**: `.DS_Store`, `Thumbs.db`, system cache files
- **Build outputs**: Compiled files, distribution folders, cache directories
- **Chrome Extension**: Packaged extension files (`.crx`, `.pem`)

This ensures that only source code and essential configuration files are tracked in version control, keeping the repository clean and secure.


## 1. AI-backend (Python - Flask)

The AI-backend is responsible for handling AI-related tasks (e.g., generating reports, meeting summaries).

### Steps to set up the AI backend:

1. *Navigate to the AI-backend directory*:
     ```bash
     cd AI-backend
   

2. *Create a virtual environment*:
   - It's recommended to set up a virtual environment to isolate your Python packages:
     ```bash
     python3 -m venv venv
     

3. *Activate the virtual environment*:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
   
   - On Windows:
     ```bash
     .\venv\Scripts\activate
   

4. *Install dependencies*:
   - Once the virtual environment is activated, install the required dependencies:
     ```bash
     pip install -r requirements.txt
   

5. *Run the Flask server*:
     ```bash
     python3 app.py
   
  The Flask server will now be running locally at http://localhost:8000 (or another port if configured).


## 2. node_backend (Node.js - Express)

This is the Node.js backend that handles API requests and integrates with other services like the AI backend and the Chrome extension.

### Steps to set up the Node backend:

1. *Navigate to the node_backend directory*:
     ```bash
     cd node_backend
   

2. *Install dependencies*:
     ```bash
     npm install
   

3. *Set up environment variables*:
   - Inside the node_backend directory, you will find a file named .env.template.
   - This file contains the structure and required environment variables for the project.
   - *Create a new .env file* by copying the *.env.template*:
       ```bash
       cp .env.template .env
     
   - Open the .env file and fill in the appropriate values for each environment variable.

   *Example of .env.template file*:
     ```bash
     PORT=3000
     MONGO_URI=your_mongodb_uri
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     JWT_KEY=your_jwt_secret
     CLIENT_URL=http://localhost:5173
     AI_SERVER_URL=http://localhost:8000
     EMAIL_USER=your_email_username
     EMAIL_PASS=your_email_password


4. *Run the Node.js server*:
     ```bash
     npm run start
   
  The backend server will now be running locally at http://localhost:3000 (or another port if configured).


## 3. Ocean AI-frontend (React - Vite)

This is the frontend for the Blabber application, built using React and Vite for fast development.

### Steps to set up the frontend:

1. *Navigate to the blabber-frontend directory*:
     ```bash
     cd Ocean AI-frontend
   

2. *Install dependencies*:
     ```bash
     npm install
   

3. *Run the development server*:
     ```bash
     npm run dev
   
  The frontend will now be available locally at http://localhost:5173.


## 4. google-meet-chrome-extension

This directory contains the Chrome extension that integrates Ocean AI with Google Meet.

### Steps to load the extension in Chrome:

1. *Open Chrome and navigate to chrome://extensions/*.

2. *Enable "Developer Mode" by toggling the switch in the upper right corner*.

3. *Click on "Load unpacked" and select the google-meet-chrome-extension directory from your local machine*.

4. *The extension will be loaded locally and will be visible in Chrome’s toolbar for testing and development purposes*.

5. *If any changes are made to the extension code, reload it by clicking the reload icon next to the extension in the chrome://extensions/ page*.

**For more detailed instructions on loading unpacked extensions, you can refer to [this blog post](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/).**


### Additional Notes:

- Database Setup (MongoDB): 
   - You will need a MongoDB database for storing user information, meeting details, etc.
   - Make sure to add your MongoDB URI in the .env file of the Node backend as MONGO_URI.

- AI Integration:
   - The AI-backend and node_backend should both be running simultaneously for full integration (AI tasks like generating reports are handled in the Python backend, while the Node.js backend manages API requests).

- Google OAuth Configuration:
   - Ensure you have Google OAuth credentials set up (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the .env file of the Node backend).
