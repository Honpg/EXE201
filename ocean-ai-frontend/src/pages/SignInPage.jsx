const SignInPage = () => {
const handleGoogleSignIn = (e) => {
    e.preventDefault();
    // const callbackUrl ="/api/oauth/google";
    const callbackUrl= "http://localhost:3000/api/oauth/google"
    window.open(callbackUrl, "_self");
};
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-purple-50">
      <div className="relative my-4 mx-4">
      <div
        className="absolute -inset-2 rounded-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 opacity-75 blur"
      ></div>
      <div className="relative p-7 lg:p-10 bg-white shadow-lg rounded-lg p-10 max-w-lg text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 mb-5">Welcome to Ocean AI</h1>
        <p className="text-lg text-gray-700 mb-6">Your one-stop solution for smart, real-time meeting transcripts and summaries.</p>
        
        {/* Features */}
        <div className="mb-6">
          <ul className="text-left text-gray-600 space-y-2 text-sm lg:text-md">
            <li>🎤 <span className="font-medium">Real-time Transcripts</span> for all your meetings.</li>
            <li>🧠 <span className="font-medium">AI-powered Summaries</span> for easy meeting insights.</li>
            <li>🔍 <span className="font-medium">Speaker Identification</span> to track who said what.</li>
            <li>📊 <span className="font-medium">Organized History</span> of all your meeting reports.</li>
          </ul>
        </div>

        {/* Sign in with Google Button */}
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google Logo" className="w-6 h-6 mr-2" />
          Sign In with Google
        </button>

        {/* Additional Info */}
        <p className="mt-6 text-gray-500 text-sm">
          Secure and seamless Google sign-in. We respect your privacy and only collect necessary information for the app to work.
        </p>
      </div>
      </div>

    </div>
  );
};

export default SignInPage;
