import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import useWithGmeet from "../assets/works-with-gmeet.jpg";
import chromeWebStore from "../assets/Available Chrome Web Store.png";
import { motion } from "framer-motion";

function Home() {
  const { state } = useAuthContext();
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center py-20">
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="mb-8"
            >
              <img 
                src={chromeWebStore} 
                alt="Available on Chrome Web Store" 
                className="w-48 mx-auto hover:scale-105 transition-transform duration-300" 
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 mb-6"
            >
              Ocean AI
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                Generate Custom Meeting Recaps, Reports, and Transcripts Using AI
              </h2>
              <p className="text-xl mb-8 text-gray-600 leading-relaxed">
                Transform your meetings with Ocean AI's <span className="text-purple-600 font-semibold">Chrome extension</span>. 
                Get intelligent summaries, detailed reports, and accurate transcripts for all your professional conversations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <img 
                src={useWithGmeet} 
                alt="Use with Google Meet" 
                className="w-64 mx-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" 
              />
              <p className="mt-4 text-gray-500 italic">More platforms coming soon...</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <button 
                onClick={() => state?.user ? navigate("/dashboard") : navigate("/login")} 
                className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white text-lg font-semibold py-3 px-8 rounded-full
                          hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Started Now
              </button>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Ocean AI?</h2>
            <p className="text-xl text-gray-600">Powerful features to enhance your meeting experience</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-Time Transcription",
                description: "Accurate, instant transcription of your meetings with speaker recognition.",
                icon: "🎯"
              },
              {
                title: "Smart Summaries",
                description: "AI-powered meeting summaries that capture key points and action items.",
                icon: "🤖"
              },
              {
                title: "Custom Reports",
                description: "Generate detailed reports tailored to your specific needs and preferences.",
                icon: "📊"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-6"
          >
            Ready to Transform Your Meetings?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl mb-8 opacity-90"
          >
            Join thousands of professionals who are already using Ocean AI to make their meetings more productive.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => state?.user ? navigate("/dashboard") : navigate("/login")}
            className="bg-white text-white bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-lg font-semibold py-3 px-8 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            Start Using Ocean AI
          </motion.button>
        </div>
      </section>
    </div>
  );
}

export default Home;
