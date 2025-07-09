from flask import Flask, send_from_directory, request, jsonify

from report_generator import generate_reports # Main function to generate reports based on user input

app = Flask(__name__)

@app.route('/report',methods=['POST'])
def get_report():
    '''Expecting: {
        "meeting_data": {},
        "report_type": "normal"/"speaker_ranking"/"sentiment"/"interval",
        "report_format": "pdf"/"docx"
    }'''
    receieved_data = request.json

    if not receieved_data:
        return jsonify({'error':'No data received'}), 400

    meeting_data = receieved_data['meeting_data']
    report_type = receieved_data['report_type']
    report_format = receieved_data['report_format']

    if 'report_interval' in receieved_data:
        report_interval = receieved_data['report_interval']

    # Validate meeting_data
    if not meeting_data:
        return jsonify({'error':'Meeting data is empty'}), 400
    if "meetingTitle" not in meeting_data or "meetingStartTimeStamp" not in meeting_data or "meetingEndTimeStamp" not in meeting_data or "attendees" not in meeting_data or 'speakers' not in meeting_data or 'transcriptData' not in meeting_data or "speakerDuration" not in meeting_data:
        return jsonify({'error':'Invalid meeting data'}), 400

    if report_type not in ['normal', 'speaker_ranking', 'sentiment', 'interval']:
        return jsonify({'error':'Invalid report type'}), 400

    if report_format not in ['pdf', 'docx']:
        return jsonify({'error':'Invalid report format'}), 400

    # Convert to the format expected by report_generator
    report_type_map = {
        'normal': 'Normal',
        'speaker_ranking': 'SpeakerRanking', 
        'sentiment': 'Sentiment',
        'interval': 'Interval'
    }
    
    report_format_map = {
        'pdf': 'PDF',
        'docx': 'DOCX'
    }
    
    report_type = report_type_map[report_type]
    report_format = report_format_map[report_format]

    # Generate
    if report_type == 'Interval' and 'report_interval' not in receieved_data:
        return jsonify({'error':'Interval report needs interval'}), 400
    
    if report_type == 'Interval':
        file_name = generate_reports(meeting_data, report_type, report_format, report_interval)
    else:
        file_name = generate_reports(meeting_data, report_type, report_format)
    file_name = file_name.split('/')[-1] # file_name is the path to the file(including ./reports/), we only need the file name
    return send_from_directory('./reports',file_name)

if __name__ == '__main__':
    app.run(port=8000,debug=True)