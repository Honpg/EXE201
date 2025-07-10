import os
from flask import Flask, jsonify, request, send_from_directory

# --- Main function to generate reports based on user input ---
from report_generator import generate_reports

app = Flask(__name__)


@app.route("/report", methods=["POST"])
def get_report():
    """
    API endpoint to generate and return a meeting report file.
    Expects a JSON payload with meeting data and report specifications.
    ---
    JSON Payload Structure:
    {
        "meeting_data": { ... },
        "report_type": "Normal" | "Sentiment",
        "report_format": "PDF" | "DOCX",
        "interval_minutes": int (optional, for future use)
    }
    """
    received_data = request.json

    if not received_data:
        return jsonify({"error": "No JSON data received"}), 400

    # --- Extract and Validate Data ---
    meeting_data = received_data.get("meeting_data")
    report_type = received_data.get("report_type")
    report_format = received_data.get("report_format")
    interval_minutes = received_data.get("interval_minutes", 5)

    if not all([meeting_data, report_type, report_format]):
        return jsonify({"error": "Missing required fields: meeting_data, report_type, or report_format"}), 400

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
    if not all(key in meeting_data for key in required_keys):
        return jsonify({"error": "Invalid or incomplete meeting_data structure"}), 400

    # --- Generate Report ---
    try:
        # The generate_reports function expects capitalized strings.
        # It raises a ValueError for invalid combinations, which is caught below.
        file_path = generate_reports(
            meeting_data,
            report_type=report_type,
            format_type=report_format,
            interval_minutes=interval_minutes,
        )

        if file_path is None:
            # This case handles internal errors within the generation function
            return jsonify({"error": "Report generation failed on the server."}), 500

        # --- Send File ---
        directory = os.path.dirname(file_path)
        filename = os.path.basename(file_path)

        return send_from_directory(directory, filename, as_attachment=True)

    except ValueError as e:
        # Catches the "Invalid report/format combination" error from generate_reports
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # Catch any other unexpected errors during file generation
        print(f"An unexpected error occurred: {e}") # Log for debugging
        return jsonify({"error": "An internal server error occurred."}), 500


if __name__ == "__main__":
    # Ensure the 'reports' directory exists before starting the app
    if not os.path.exists("./reports"):
        os.makedirs("./reports")
    app.run(port=8000, debug=True)
