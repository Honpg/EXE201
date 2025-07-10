import os
from flask import Flask, jsonify, request, send_from_directory
import traceback
import json

# --- Main function to generate reports based on user input ---
from report_generator import generate_reports

app = Flask(__name__)

@app.route("/report", methods=["POST"])
def get_report():
    """
    API endpoint to generate and return a meeting report file.
    """
    # Ghi nhật ký chi tiết hơn
    print("\n--- NEW REPORT REQUEST ---")
    try:
        received_data = request.json
        print(f"Received raw request data: {json.dumps(received_data, indent=2)}")
        
        if not received_data:
            print("ERROR: No JSON data received")
            return jsonify({"error": "No JSON data received"}), 400

        # --- Extract and Validate Data ---
        meeting_data = received_data.get("meeting_data")
        report_type = received_data.get("report_type")
        report_format = received_data.get("report_format")
        interval_minutes = received_data.get("interval_minutes", 5)
        
        print(f"Extracted fields: report_type={report_type}, report_format={report_format}, interval_minutes={interval_minutes}")
        
        if meeting_data:
            print(f"Meeting data keys: {list(meeting_data.keys())}")
        else:
            print("ERROR: meeting_data is missing or null")
            
        if not all([meeting_data, report_type, report_format]):
            missing = []
            if not meeting_data: missing.append("meeting_data")
            if not report_type: missing.append("report_type")
            if not report_format: missing.append("report_format")
            error_msg = f"Missing required fields: {', '.join(missing)}"
            print(f"ERROR: {error_msg}")
            return jsonify({"error": error_msg}), 400

        # Validate essential keys in meeting_data
        required_keys = [
            "meetingTitle",
            "meetingStartTimeStamp",
            "meetingEndTimeStamp",
            "convenor",
            "attendees",
            "transcriptData",
            "speakerDuration",
        ]
        
        missing_keys = [key for key in required_keys if key not in meeting_data]
        if missing_keys:
            error_msg = f"Missing required keys in meeting_data: {', '.join(missing_keys)}"
            print(f"ERROR: {error_msg}")
            return jsonify({"error": error_msg}), 400
        
        # --- 💡 FIX: Standardize inputs to prevent case-sensitivity errors ---
        # This ensures "normal" becomes "Normal" and "pdf" becomes "PDF".
        report_type_standardized = report_type.capitalize()
        report_format_standardized = report_format.upper()
        
        print(f"Standardized fields: report_type={report_type_standardized}, report_format={report_format_standardized}")

        # --- Generate Report ---
        try:
            print("Starting report generation...")
            file_path = generate_reports(
                meeting_data,
                report_type=report_type_standardized,
                format_type=report_format_standardized,
                interval_minutes=interval_minutes,
            )
            
            if file_path is None:
                print("ERROR: Report generation returned None")
                return jsonify({"error": "Report generation failed on the server."}), 500

            print(f"Report generated successfully at: {file_path}")
            # --- Send File ---
            directory = os.path.dirname(file_path)
            filename = os.path.basename(file_path)

            return send_from_directory(directory, filename, as_attachment=True)

        except ValueError as e:
            print(f"ERROR (ValueError): {str(e)}")
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            print(f"ERROR (Unexpected): {str(e)}")
            print(traceback.format_exc())
            return jsonify({"error": "An internal server error occurred."}), 500
            
    except Exception as e:
        print(f"ERROR (Request Processing): {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Error processing request"}), 400

if __name__ == "__main__":
    # Ensure the 'reports' directory exists before starting the app
    if not os.path.exists("./reports"):
        os.makedirs("./reports")
    app.run(port=8000, debug=True)

