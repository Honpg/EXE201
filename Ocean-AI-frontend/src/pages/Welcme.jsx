
function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 text-gray-800 pt-20">
      <header className="text-center mb-10">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">Welcome to Ocean AI!</h1>
        <p className="text-xl text-gray-800">Your AI-powered meeting companion</p>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <section className="mb-10">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">What is Ocean AI?</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Ocean AI is a Chrome extension designed to help you manage and document your meetings seamlessly. With its AI-enabled features, you can easily keep track of your meetings, attendees, and speakers while generating comprehensive reports.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:bg-gray-50 hover:shadow-xl transition-all duration-300">
              <span className="text-6xl mb-2">📋</span>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">Track Your Meetings</h3>
              <p className="text-sm text-gray-700">Easily keep track of your meets and attendees.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:bg-gray-50 hover:shadow-xl transition-all duration-300">
              <span className="text-6xl mb-2">📝</span>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">Generate Reports</h3>
              <p className="text-sm text-gray-700">Create customizable reports in PDF and DOCX formats.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:bg-gray-50 hover:shadow-xl transition-all duration-300">
              <span className="text-6xl mb-2">✉️</span>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">Email Reports</h3>
              <p className="text-sm text-gray-700">Send reports directly to users' email addresses.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">Reporting Customizations</h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-4">
            Customize your reports with different styles:
          </p>
          <ul className="list-disc pl-8 text-gray-700 space-y-2">
            <li>📊 <strong>Speaker-Based Reports:</strong> Focus on individual speakers and their contributions.</li>
            <li>⏱️ <strong>Interval-Based Reports:</strong> Analyze discussions based on time intervals.</li>
            <li>💬 <strong>Sentiment-Based Reports:</strong> Get insights into the emotional tone of the meeting.</li>
            <li>🗒️ <strong>General Reports:</strong> Overview of all meeting details and key points.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">Screenshots Included!</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Capture screenshots during your meetings and include them in your reports for better context and clarity.
          </p>
        </section>
      </main>

      <footer className="mt-10 mb-4">
        <p className="text-sm text-gray-500">Made with ❤️ by the Ocean AI team</p>
      </footer>
    </div>
  );
}

export default Welcome;
