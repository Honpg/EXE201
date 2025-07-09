INSTRUCTION = """
    You are an assistant summarizing a professional meeting. Below is the full transcript. Your task is to:
    1. Provide a clear, concise summary of the main discussion points.
    2. Identify any decisions made or actions assigned.
    3. List out follow-up tasks, if any, along with the responsible persons.
    4. Include the meeting date and participants if available.
    Keep the tone professional and suitable for email or documentation. Use bullet points where helpful.
"""

SAMPLE_DATA_ENG = {
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








SAMPLE_DATA_VN = {
    "meetingTitle": "Cuộc họp đồng bộ dự án",
    "convenor": "TitaNyte Official",
    "speakers": ["TitaNyte Official", "Prateek"],
    "meetingStartTimeStamp": "2024-09-29T12:20:48.000Z",
    "meetingEndTimeStamp": "2024-09-29T12:26:09.000Z",
    "attendees": ["Prateek", "TitaNyte Official"],
    "speakerDuration": {"TitaNyte Official": 163, "Prateek": 104},
    "transcriptData": [
        {
            "name": "TitaNyte Official",
            "content": "Chào bạn, dạo này bạn thế nào?",
            "timeStamp": "2024-09-29T12:21:37.000Z",
        },
        {
            "name": "Prateek",
            "content": "Chào bạn, mình ổn. Vậy hôm nay chúng ta sẽ thảo luận về những gì?",
            "timeStamp": "2024-09-29T12:21:38.000Z",
        },
        {
            "name": "Prateek",
            "content": "Hãy thảo luận về các tính năng mà tiện ích mở rộng của chúng ta sẽ cung cấp cho người dùng. Đầu tiên là khả năng tạo bản chép lời, được lấy từ phụ đề của Google Meet.",
            "timeStamp": "2024-09-29T12:21:45.000Z",
        },
        {
            "name": "TitaNyte Official",
            "content": "Chắc chắn rồi. Khi các bản chép lời này được lưu vào cơ sở dữ liệu, một mô hình AI sinh văn bản sẽ xử lý chúng để tạo báo cáo dựa trên các bộ lọc như theo người nói hoặc theo khoảng thời gian.",
            "timeStamp": "2024-09-29T12:22:12.000Z",
        },
        {
            "name": "TitaNyte Official",
            "content": "Trên giao diện người dùng, bạn đăng nhập bằng Google. Khi bạn nhấn nút 'Tạo báo cáo', một hộp thoại sẽ hiện ra để bạn nhập tiêu đề cuộc họp và chọn định dạng báo cáo như DOCX hoặc PDF.",
            "timeStamp": "2024-09-29T12:23:02.000Z",
        },
        {
            "name": "TitaNyte Official",
            "content": "Bạn cũng có thể thêm prompt để nâng cao chất lượng báo cáo. Tiện ích này còn cho phép chụp ảnh màn hình để lưu lại những nội dung đã chia sẻ trong cuộc họp.",
            "timeStamp": "2024-09-29T12:23:42.000Z",
        },
        {
            "name": "Prateek",
            "content": "Giờ mình sẽ hướng dẫn cách mọi người có thể sử dụng tiện ích này thông qua repo. Trước tiên, họ cần clone repository và cài đặt các gói cần thiết. Nó đã có sẵn trên Chrome Store rồi.",
            "timeStamp": "2024-09-29T12:24:30.000Z",
        },
        {
            "name": "Prateek",
            "content": "Họ cần chạy NPM install cho cả front-end và back-end, và pip install cho phần AI back-end. Sau đó, họ sẽ phải thiết lập biến môi trường mà chúng ta sẽ cung cấp.",
            "timeStamp": "2024-09-29T12:25:02.000Z",
        },
        {
            "name": "TitaNyte Official",
            "content": "Bạn cũng cần thêm file .env.example để minh họa định dạng của các biến môi trường. Vậy là chúng ta ổn rồi đúng không?",
            "timeStamp": "2024-09-29T12:25:42.000Z",
        },
        {
            "name": "Prateek",
            "content": "Ừ, mọi thứ đã ổn rồi. Cảm ơn bạn.",
            "timeStamp": "2024-09-29T12:26:02.000Z",
        },
    ],
}
