import requests

# The main JSON payload for the request
json_payload = {
    "report_type": "Normal",
    "report_format": "PDF",
    "meeting_data": {
        "meetingTitle": "Project-Sync-Meeting",
        "convenor": "TitaNyte Official",
        "speakers": ["TitaNyte Official", "Prateek"],
        "meetingStartTimeStamp": "2024-09-29T12:20:48.000Z",
        "meetingEndTimeStamp": "2024-09-29T12:26:09.000Z",
        "attendees": ["Prateek", "TitaNyte Official"],
        "speakerDuration": {"TitaNyte Official": 163, "Prateek": 104},
        "transcriptData": [
            {
                "name": "TitaNyte Official",
                "content": "Hi, how are you?",
                "timeStamp": "2024-09-29T12:21:37.000Z",
            },
            {
                "name": "Prateek",
                "content": "Hi, I'm fine. So what's going to be the agenda of today's discussion",
                "timeStamp": "2024-09-29T12:21:38.000Z",
            },
            {
                "name": "Prateek",
                "content": "Let's discuss about the features that our extension is going to give to the users. The first is that it will give transcriptions, which it will scrape from Google Meet captions.",
                "timeStamp": "2024-09-29T12:21:45.000Z",
            },
            {
                "name": "TitaNyte Official",
                "content": "Sure. Once those transcripts are stored in the database, we have a generative AI model which takes these transcripts and then tries to create reports based on filters like speaker-based or interval-based reporting.",
                "timeStamp": "2024-09-29T12:22:12.000Z",
            },
            {
                "name": "TitaNyte Official",
                "content": "On the front end, you log in using Google. As soon as you click the Generate button, a modal will pop up where you can enter the meeting title and choose the report format, like DOCX or PDF.",
                "timeStamp": "2024-09-29T12:23:02.000Z",
            },
            {
                "name": "TitaNyte Official",
                "content": "You can also add Prompts to enhance the report creation. The extension also lets you take screenshots to keep track of what was shared during the meeting.",
                "timeStamp": "2024-09-29T12:23:42.000Z",
            },
            {
                "name": "Prateek",
                "content": "Okay, so now I will be covering how anyone can use our extension through our repo. First, they'll have to clone the repository and install all the packages. It is already available on the Chrome store.",
                "timeStamp": "2024-09-29T12:24:30.000Z",
            },
            {
                "name": "Prateek",
                "content": "They will have to do an NPM install for both front-end and back-end, and a pip install for the AI back-end. Afterwards, they will have to set the environment variables, which we will provide.",
                "timeStamp": "2024-09-29T12:25:02.000Z",
            },
            {
                "name": "TitaNyte Official",
                "content": "You also have to add a .env.example file, which shows the format for the environment variables. I think we're good to go, right?",
                "timeStamp": "2024-09-29T12:25:42.000Z",
            },
            {
                "name": "Prateek",
                "content": "Yeah, we are good to go. Thank you.",
                "timeStamp": "2024-09-29T12:26:02.000Z",
            },
        ],
    }
}

# Send the POST request to the Flask server
response = requests.post("http://127.0.0.1:8000/report", json=json_payload)

# Save the report if the request was successful
if response.status_code == 200:
    # Check if the response is a PDF to avoid saving error messages as a file
    if 'application/pdf' in response.headers.get('Content-Type', ''):
        with open("output_report.pdf", "wb") as f:
            f.write(response.content)
        print("✅ Report downloaded successfully as output_report.pdf")
    else:
        print("❗️ Received a success status, but the response is not a PDF. Response text:")
        print(response.text)
else:
    print(f"❌ Error: {response.status_code}")
    print("Response Body:", response.text)
