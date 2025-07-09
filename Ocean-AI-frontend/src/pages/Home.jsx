import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import useWithGmeet from "../assets/works-with-gmeet.jpg";
import chromeWebStore from "../assets/Available Chrome Web Store.png";

function Home() {
  const { state } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100">
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <main className="flex flex-col items-center px-4 text-center">
          {/* Chrome Web Store image */}
          <img src={chromeWebStore} alt="Available on Chrome Web Store" className="w-1/6 mx-auto" />          {/* Ocean AI logo */}
          <h1 className="text-9xl mb-4 superlarge logo-bg">Ocean AI</h1>
          <div className="container mx-auto w-2/3">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Generate custom meeting recaps, reports, and transcripts using AI
            </h2>
            <p className="mb-4 text-gray-700">
              Use Ocean AI, a <u>Chrome extension</u>, to generate meeting recaps, reports, and transcripts for your meetings, interviews, and other conversations.
            </p>
            <img src={useWithGmeet} alt="Use with Gmeet" className="w-1/4 mx-auto" />
            <p className="mb-8 text-gray-600">Other platforms coming soon...</p>
            <button 
              onClick={() => state?.user ? navigate("/dashboard") : navigate("/login")} 
              className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-orange-500 hover:via-pink-600 hover:to-purple-700 transition-all font-medium shadow-lg"
            >
              Get Started
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
