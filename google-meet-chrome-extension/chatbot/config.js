// config.js - Configuration file for Ocean AI Extension

// Try to load environment variables (if env.js exists)
let envConfig = {};
try {
    // This will load env.js if it exists
    if (typeof window !== 'undefined' && window.ENV) {
        envConfig = window.ENV;
    }
} catch (e) {
    console.log('env.js not found, using default config');
}

// Gemini API Configuration
const CONFIG = {
    // API Key from environment or fallback to hardcoded (not recommended for production)
    GEMINI_API_KEY: envConfig.GEMINI_API_KEY || 'AIzaSyAra7sySoUWq3ait9Y3kHnIdd_0ay_6kEY',
    
    // Gemini API endpoint
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
    
    // Chatbot settings
    CHATBOT: {
        MAX_CONTEXT_LENGTH: envConfig.CHATBOT_MAX_CONTEXT || 1000,
        MAX_RESPONSE_LENGTH: envConfig.CHATBOT_MAX_RESPONSE || 200,
        TEMPERATURE: envConfig.CHATBOT_TEMPERATURE || 0.7,
        MAX_CHAT_HISTORY: envConfig.CHATBOT_MAX_HISTORY || 50
    },
    
    // Backend API settings
    BACKEND: {
        BASE_URL: envConfig.BACKEND_URL || 'https://oceanai.azurewebsites.net',
        ENDPOINTS: {
            REGISTER: '/api/register-from-extension',
            MEET: '/api/meet',
            CHAT: '/api/chat' // For future chat storage if needed
        }
    }
};

// Instructions for getting Gemini API Key:
/*
To get your Gemini API key:

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the generated API key
5. Replace 'YOUR_GEMINI_API_KEY_HERE' above with your actual API key

Note: Keep your API key secure and never share it publicly!
*/

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
