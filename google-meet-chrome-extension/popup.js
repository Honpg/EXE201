// window.onload = function () {
//   chrome.storage.local.get(["oauthEmail"], function (result) {
//     if (result.oauthEmail) {
//       document.querySelector("#email").innerText = `Logged in as ${result.oauthEmail}!`;
//       document.querySelector(".signed-in-only").style.display = "block";
//     } else {
//       document.querySelector("#email").innerText = "Not signed in!";
//       document.querySelector(".signed-in-only").style.display = "none";
//     }
//   }
//   )
// }

console.log('popup.js loaded');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded');
  setupPopup();
});

// Also try window.onload as backup
window.addEventListener('load', function() {
  console.log('Window loaded');
  if (!window.popupInitialized) {
    setupPopup();
  }
});

function setupPopup() {
  console.log('Setting up popup...');
  
  if (window.popupInitialized) {
    console.log('Popup already initialized');
    return;
  }
  
  window.popupInitialized = true;
  
  // Setup auth check
  setupAuth();
  
  // Setup event listeners
  setupEventListeners();
}

function setupAuth() {
  console.log('Setting up auth...');
  
  fetch(`${window.OCEAN_AI_CONFIG?.API_BASE_URL || 'https://oceanai.azurewebsites.net'}/api/users/check`, {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        document.querySelector("#email").innerText = `Logged in as ${data.user.email}!`;
        document.querySelector(".signed-in-only").style.display = "block";
      } else {
        document.querySelector("#email").innerText = "Not signed in!";
        document.querySelector(".signed-in-only").style.display = "none";
      }
    })
    .catch(err => {
      console.error("Auth check failed", err);
      document.querySelector("#email").innerText = "Not signed in!";
      document.querySelector(".signed-in-only").style.display = "none";
    });
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // View meetings button
  const viewMeetingsBtn = document.getElementById('view-meetings');
  if (viewMeetingsBtn) {
    viewMeetingsBtn.addEventListener('click', function () {
      console.log('View meetings clicked');
      chrome.tabs.create({ url: 'http://localhost:5173/dashboard' });
    });
  } else {
    console.log('View meetings button not found');
  }
  
  // Chatbot button - show chatbot in popup
  const chatbotBtn = document.getElementById('chatbot-btn');
  if (chatbotBtn) {
    console.log('Chatbot button found, adding event listener');
    chatbotBtn.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('Chatbot button clicked');
      showChatbot();
    });
  } else {
    console.log('Chatbot button not found');
  }
  
  // Setup chatbot event listeners
  setupChatbotListeners();
}

function showChatbot() {
  console.log('Showing chatbot...');
  
  const mainDiv = document.querySelector('.wrapper-div');
  const chatbotDiv = document.getElementById('chatbot-container');
  
  if (mainDiv && chatbotDiv) {
    mainDiv.style.display = 'none';
    chatbotDiv.style.display = 'flex';
    
    // Add welcome message if not already shown
    if (!window.welcomeMessageShown) {
      setTimeout(() => {
        addMessage("Hi! I'm your AI assistant. I can help you with questions about your meetings, transcripts, or anything else you'd like to know!", 'bot');
        window.welcomeMessageShown = true;
      }, 500);
    }
  }
}

function showMainMenu() {
  console.log('Showing main menu...');
  
  const mainDiv = document.querySelector('.wrapper-div');
  const chatbotDiv = document.getElementById('chatbot-container');
  
  if (mainDiv && chatbotDiv) {
    chatbotDiv.style.display = 'none';
    mainDiv.style.display = 'block';
  }
}

function setupChatbotListeners() {
  console.log('Setting up chatbot listeners...');
  
  // Back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Back button clicked');
      showMainMenu();
    });
  }
  
  // Send button
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Send button clicked');
      sendMessage();
    });
  }
  
  // Chat input enter key
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  // Test button
  const testBtn = document.getElementById('test-btn');
  if (testBtn) {
    testBtn.addEventListener('click', function(e) {
      e.preventDefault();
      testAPI();
    });
  }
  
  // Clear button
  const clearBtn = document.getElementById('clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function(e) {
      e.preventDefault();
      clearChat();
    });
  }
  
  // Debug button
  const debugBtn = document.getElementById('debug-btn');
  if (debugBtn) {
    debugBtn.addEventListener('click', function(e) {
      e.preventDefault();
      debugChatbot();
    });
  }
}

function addMessage(text, sender) {
  console.log('Adding message:', text, 'from:', sender);
  
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) {
    console.error('Chat messages container not found');
    return;
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = text;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.style.display = 'block';
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.style.display = 'none';
  }
}

async function sendMessage() {
  console.log('Sending message...');
  
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  
  if (!chatInput || !sendBtn) {
    console.error('Chat input or send button not found');
    return;
  }
  
  const message = chatInput.value.trim();
  if (!message) {
    console.log('No message to send');
    return;
  }
  
  console.log('User message:', message);
  
  // Add user message
  addMessage(message, 'user');
  
  // Clear input and disable send button
  chatInput.value = '';
  sendBtn.disabled = true;
  
  // Show typing indicator
  showTypingIndicator();
  
  try {
    // Load config first
    console.log('Loading chatbot configuration...');
    await loadChatbotConfig();
    
    // Wait for config to be available
    await waitForConfig();
    
    // Call Gemini API
    const response = await callGeminiAPI(message, 'User is asking about meeting assistance');
    
    // Hide typing indicator
    hideTypingIndicator();
    
    // Add bot response
    addMessage(response, 'bot');
    
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Hide typing indicator
    hideTypingIndicator();
    
    // Add detailed error message
    let errorMessage = 'Sorry, I encountered an error. ';
    if (error.message.includes('Configuration')) {
      errorMessage += 'Configuration failed to load. Please check the console for details.';
    } else if (error.message.includes('API key')) {
      errorMessage += 'API key is missing or invalid.';
    } else {
      errorMessage += 'Please try again. Error: ' + error.message;
    }
    
    addMessage(errorMessage, 'bot');
  } finally {
    // Re-enable send button
    sendBtn.disabled = false;
  }
}

async function callGeminiAPI(message, context) {
  console.log('Calling Gemini API...');
  
  // Load config from chatbot folder
  await loadChatbotConfig();
  
  if (!window.CONFIG) {
    throw new Error('CONFIG not loaded');
  }
  
  const API_KEY = window.CONFIG.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error('API key not found in config');
  }
  
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;
  
  const prompt = `You are Ocean AI, a versatile and friendly chatbot that can engage in ANY conversation naturally. You are knowledgeable about all topics including games, movies, sports, technology, daily life, entertainment, science, history, and much more.

CRITICAL INSTRUCTIONS:
1. NEVER reject questions that are not about meetings
2. NEVER say you are primarily a meeting assistant
3. NEVER redirect conversations back to meetings
4. Answer ALL questions directly and naturally
5. Only use meeting context if explicitly asked about meetings
6. Treat every topic with equal enthusiasm and knowledge

LANGUAGE AND FORMATTING RULES:
- Respond in the SAME LANGUAGE as the user's question
- If user asks in English, respond in English
- If user asks in Vietnamese, respond in Vietnamese using proper UTF-8 encoding with correct diacritics
- If user asks in any other language, respond in that language
- Provide only plain text responses without any formatting
- Do not use markdown, bullet points, asterisks, or special characters
- Do not use numbered lists or bullet points
- Do not use bold or italic formatting
- Write in simple, continuous sentences separated by periods
- Aim for detailed responses (100-150 words)
- Use paragraphs for complex explanations
- Include examples or analogies when helpful
- Add relevant details and context
- Answer directly and concisely without extra formatting
- Ensure proper character encoding for all languages

Meeting context (ONLY use if the question is specifically about meetings):
${context}

User question: ${message}

Instructions: Analyze the user's question and respond naturally. If it's about meetings, use the context. If it's about anything else, ignore the meeting context completely and answer based on your general knowledge. Be enthusiastic and knowledgeable about all topics.`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.9,    // Increased for more creative responses
      topK: 80,           // Increased for broader vocabulary
      topP: 0.98,         // Increased for more diverse responses
      maxOutputTokens: 1200, // Increased for longer, more detailed responses
    }
  };
  
  try {
    console.log('Making API request to:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

async function loadChatbotConfig() {
  return new Promise((resolve, reject) => {
    if (window.CONFIG) {
      console.log('CONFIG already exists');
      resolve();
      return;
    }
    
    console.log('Loading chatbot configuration...');
    
    // Load env.js first
    const envScript = document.createElement('script');
    envScript.src = 'chatbot/env.js';
    envScript.onload = () => {
      console.log('env.js loaded successfully');
      console.log('ENV exists:', !!window.ENV);
      loadConfig();
    };
    envScript.onerror = (error) => {
      console.log('env.js not found or failed to load, loading config directly');
      loadConfig();
    };
    document.head.appendChild(envScript);
    
    function loadConfig() {
      // Load config.js
      const configScript = document.createElement('script');
      configScript.src = 'chatbot/config.js';
      configScript.onload = () => {
        console.log('config.js loaded successfully');
        console.log('CONFIG exists:', !!window.CONFIG);
        if (window.CONFIG) {
          console.log('CONFIG keys:', Object.keys(window.CONFIG));
          console.log('API Key exists:', !!window.CONFIG.GEMINI_API_KEY);
          if (window.CONFIG.GEMINI_API_KEY) {
            const key = window.CONFIG.GEMINI_API_KEY;
            console.log('API Key (masked):', key.substring(0, 4) + '...' + key.substring(key.length - 4));
          }
        }
        resolve();
      };
      configScript.onerror = (error) => {
        console.error('Failed to load config.js:', error);
        reject(new Error('Failed to load configuration'));
      };
      document.head.appendChild(configScript);
    }
  });
}

function waitForConfig() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
    function checkConfig() {
      attempts++;
      console.log(`Waiting for CONFIG... Attempt ${attempts}/${maxAttempts}`);
      
      if (window.CONFIG) {
        console.log('CONFIG found!');
        resolve();
      } else if (attempts >= maxAttempts) {
        console.error('CONFIG failed to load after maximum attempts');
        reject(new Error('Configuration timeout'));
      } else {
        setTimeout(checkConfig, 100);
      }
    }
    
    checkConfig();
  });
}

// Clear chat function
function clearChat() {
  console.log('Clearing chat messages...');
  const chatMessages = document.getElementById('chat-messages');
  if (chatMessages) {
    chatMessages.innerHTML = '';
    window.welcomeMessageShown = false;
    
    // Add welcome message again
    setTimeout(() => {
      addMessage("Hi! I'm your AI assistant. I can help you with questions about your meetings, transcripts, or anything else you'd like to know!", 'bot');
      window.welcomeMessageShown = true;
    }, 200);
  }
}

// Test function for API
async function testAPI() {
  console.log('Testing API configuration...');
  
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) {
    console.error('Chat messages container not found');
    return;
  }
  
  const testMessage = document.createElement('div');
  testMessage.className = 'message bot';
  testMessage.textContent = 'Testing API... Please wait.';
  chatMessages.appendChild(testMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  try {
    // Load config first
    console.log('Loading configuration for test...');
    await loadChatbotConfig();
    await waitForConfig();
    
    // Test simple message
    const response = await callGeminiAPI('Hello, can you respond?', 'Test context');
    testMessage.textContent = 'API Test Result: ' + response;
    testMessage.style.background = '#d4edda';
    testMessage.style.color = '#155724';
  } catch (error) {
    testMessage.textContent = 'API Test Failed: ' + error.message;
    testMessage.style.background = '#f8d7da';
    testMessage.style.color = '#721c24';
    console.error('API Test Error:', error);
  }
  
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Debug function
function debugChatbot() {
  console.log('=== CHATBOT DEBUG ===');
  console.log('CONFIG exists:', !!window.CONFIG);
  if (window.CONFIG) {
    console.log('CONFIG keys:', Object.keys(window.CONFIG));
    console.log('API URL:', window.CONFIG.GEMINI_API_URL);
    console.log('API Key exists:', !!window.CONFIG.GEMINI_API_KEY);
    if (window.CONFIG.GEMINI_API_KEY) {
      const key = window.CONFIG.GEMINI_API_KEY;
      console.log('API Key (masked):', key.substring(0, 4) + '...' + key.substring(key.length - 4));
    }
  }
  
  const chatMessages = document.getElementById('chat-messages');
  if (chatMessages) {
    const debugMsg = document.createElement('div');
    debugMsg.className = 'message bot';
    debugMsg.style.background = '#ffc107';
    debugMsg.style.color = '#000';
    debugMsg.textContent = `Debug Info: 
CONFIG: ${!!window.CONFIG}
API Key: ${window.CONFIG?.GEMINI_API_KEY ? 'Available' : 'Missing'}
URL: ${window.CONFIG?.GEMINI_API_URL || 'Default'}`;
    chatMessages.appendChild(debugMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}
