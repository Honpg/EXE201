from flask import Flask, send_from_directory, request, jsonify
import logging
import time

from report_generator import generate_reports # Main function to generate reports based on user input
from report_generator import PDF_Type, DOCX_Type # Report formats
from report_generator import NormalReport, SpeakerRankingReport, SentimentReport, IntervalReport # Report types

app = Flask(__name__)

# Thiết lập logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('flask_app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@app.route('/report',methods=['POST'])
def get_report():
    '''Expecting: {
        "meeting_data": {},
        "report_type": "normal"/"speaker_ranking"/"sentiment"/"interval",
        "report_format": "pdf"/"docx"
    }'''
    start_time = time.time()
    logger.info("Nhận request tạo report")
    
    receieved_data = request.json

    if not receieved_data:
        logger.error("Không nhận được dữ liệu")
        return jsonify({'error':'No data received'}), 400

    meeting_data = receieved_data['meeting_data']
    report_type = receieved_data['report_type']
    report_format = receieved_data['report_format']

    logger.info(f"Tạo report loại: {report_type}, format: {report_format}")

    if 'report_interval' in receieved_data:
        report_interval = receieved_data['report_interval']

    # Validate meeting_data
    if not meeting_data:
        logger.error("Dữ liệu meeting trống")
        return jsonify({'error':'Meeting data is empty'}), 400
    if "meetingTitle" not in meeting_data or "meetingStartTimeStamp" not in meeting_data or "meetingEndTimeStamp" not in meeting_data or "attendees" not in meeting_data or 'speakers' not in meeting_data or 'transcriptData' not in meeting_data or "speakerDuration" not in meeting_data:
        logger.error("Dữ liệu meeting không hợp lệ")
        return jsonify({'error':'Invalid meeting data'}), 400

    # Log thông tin về dữ liệu
    transcript_count = len(meeting_data.get('transcriptData', []))
    speaker_count = len(meeting_data.get('speakers', []))
    logger.info(f"Dữ liệu meeting: {transcript_count} transcript entries, {speaker_count} speakers")

    if report_type == 'normal':
        report_type = NormalReport
    elif report_type == 'speaker_ranking':
        report_type = SpeakerRankingReport
    elif report_type == 'sentiment':
        report_type = SentimentReport
    elif report_type == 'interval':
        report_type = IntervalReport
    else:
        logger.error(f"Loại report không hợp lệ: {report_type}")
        return jsonify({'error':'Invalid report type'}), 400

    if report_format == 'pdf':
        report_format = PDF_Type
    elif report_format == 'docx':
        report_format = DOCX_Type
    else:
        logger.error(f"Format report không hợp lệ: {report_format}")
        return jsonify({'error':'Invalid report format'}), 400

    # Generate
    if report_type == IntervalReport and not report_interval:
        logger.error("Interval report thiếu tham số interval")
        return jsonify({'error':'Interval report needs interval'}), 400
    
    try:
        logger.info("Bắt đầu tạo report...")
        generation_start = time.time()
        
        # Thêm timeout 120 giây (2 phút)
        import signal
        
        def timeout_handler(signum, frame):
            raise TimeoutError("Report generation timeout after 120 seconds")
        
        signal.signal(signal.SIGALRM, timeout_handler)
        signal.alarm(120)  # 120 giây timeout
        
        try:
            if report_type == IntervalReport:
                file_name = generate_reports(meeting_data, report_type, report_format, report_interval)
            else:
                file_name = generate_reports(meeting_data, report_type, report_format)
        finally:
            signal.alarm(0)  # Tắt timeout
        
        generation_time = time.time() - generation_start
        logger.info(f"Tạo report thành công trong {generation_time:.2f}s")
        
        file_name = file_name.split('/')[-1] # file_name is the path to the file(including ./reports/), we only need the file name
        
        total_time = time.time() - start_time
        logger.info(f"Tổng thời gian xử lý request: {total_time:.2f}s")
        
        return send_from_directory('./reports',file_name)
        
    except TimeoutError as e:
        total_time = time.time() - start_time
        logger.error(f"Timeout tạo report sau {total_time:.2f}s")
        return jsonify({'error': 'Report generation timeout. Please try with shorter content.'}), 408
    except Exception as e:
        total_time = time.time() - start_time
        logger.error(f"Lỗi tạo report sau {total_time:.2f}s: {str(e)}")
        return jsonify({'error': f'Report generation failed: {str(e)}'}), 500

if __name__ == '__main__':
    logger.info("Khởi động Flask app trên port 8000")
    app.run(port=8000,debug=True)