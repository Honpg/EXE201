// chatbot.js - Ocean AI Chatbot Logic

document.addEventListener('DOMContentLoaded', function() {
    console.log('[Chatbot] DOM loaded, starting configuration loading');
    // Load configuration after DOM is ready
    loadConfig().then(() => {
        console.log('[Chatbot] Configuration loaded, initializing chatbot');
        initializeChatbot();
    });
});

async function loadConfig() {
    console.log('[Chatbot] Starting config.js loading');
    // Load config.js dynamically
    const script = document.createElement('script');
    script.src = 'config.js';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
        script.onload = () => {
            console.log('[Chatbot] Config.js loaded successfully');
            console.log('[Chatbot] CONFIG object exists:', !!window.CONFIG);
            if (window.CONFIG) {
                console.log('[Chatbot] CONFIG keys:', Object.keys(window.CONFIG));
                console.log('[Chatbot] API Key exists:', !!window.CONFIG.GEMINI_API_KEY);
                // Mask key for logging
                if (window.CONFIG.GEMINI_API_KEY) {
                    const key = window.CONFIG.GEMINI_API_KEY;
                    const maskedKey = key.substring(0, 4) + '...' + key.substring(key.length - 4);
                    console.log('[Chatbot] API Key (masked):', maskedKey);
                }
            }
            resolve();
        };
        script.onerror = (e) => {
            console.error('[Chatbot] Failed to load config.js:', e);
            resolve(); // Continue anyway with defaults
        };
    });
}

function initializeChatbot() {
    console.log('[Chatbot] Initializing chatbot components');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const backButton = document.getElementById('back-btn');
    const lockButton = document.getElementById('lock-btn');
    
    console.log('[Chatbot] DOM elements found:', {
        messageInput: !!messageInput,
        sendButton: !!sendButton,
        chatMessages: !!chatMessages,
        typingIndicator: !!typingIndicator,
        backButton: !!backButton,
        lockButton: !!lockButton
    });

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Back button - open main popup
    backButton.addEventListener('click', function() {
        console.log('[Chatbot] Back button clicked, opening main popup');
        chrome.windows.create({
            url: chrome.runtime.getURL('popup.html'),
            type: 'popup',
            width: 350,
            height: 400,
            focused: true
        });
        window.close();
    });

    // Lock button functionality
    let isLocked = false;
    const statusBar = document.getElementById('status-bar');
    
    lockButton.addEventListener('click', function() {
        isLocked = !isLocked;
        console.log('[Chatbot] Lock toggled:', isLocked);
        
        if (isLocked) {
            lockButton.textContent = '🔓';
            lockButton.title = 'Unlock Popup (Click outside to keep open)';
            lockButton.classList.add('locked');
            statusBar.classList.add('show');
            
            // Prevent popup from closing when clicking outside
            document.addEventListener('click', preventClose);
            document.addEventListener('blur', preventClose);
            
            console.log('[Chatbot] Popup locked - will not close when clicking outside');
        } else {
            lockButton.textContent = '🔒';
            lockButton.title = 'Lock Popup (Prevent auto-close)';
            lockButton.classList.remove('locked');
            statusBar.classList.remove('show');
            
            // Remove prevent close listeners
            document.removeEventListener('click', preventClose);
            document.removeEventListener('blur', preventClose);
            
            console.log('[Chatbot] Popup unlocked - normal behavior restored');
        }
    });

    function preventClose(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    // Auto-focus input
    messageInput.focus();
    
    // Test Vietnamese encoding
    testVietnameseEncoding();

    async function sendMessage() {
        console.log('[Chatbot] sendMessage function called');
        const message = messageInput.value.trim();
        console.log('[Chatbot] User message:', message);
        if (!message) {
            console.log('[Chatbot] Empty message, ignoring');
            return;
        }

        // Disable input while processing
        console.log('[Chatbot] Disabling input while processing');
        setInputState(false);

        // Add user message to chat
        console.log('[Chatbot] Adding user message to chat');
        addMessage(message, 'user');

        // Clear input
        messageInput.value = '';

        // Show typing indicator
        console.log('[Chatbot] Showing typing indicator');
        showTypingIndicator(true);

        try {
            // Get context from stored meeting data
            console.log('[Chatbot] Getting meeting context');
            const context = await getMeetingContext();
            console.log('[Chatbot] Meeting context retrieved, length:', context.length);
            
            // Call Gemini API
            console.log('[Chatbot] Calling Gemini API');
            const startTime = Date.now();
            const response = await callGeminiAPI(message, context);
            const endTime = Date.now();
            console.log(`[Chatbot] API response received in ${endTime - startTime}ms, length:`, response.length);
            
            // Add bot response to chat
            console.log('[Chatbot] Adding bot response to chat');
            addMessage(response, 'bot');
        } catch (error) {
            console.error('[Chatbot] Error in sendMessage flow:', error);
            console.error('[Chatbot] Error name:', error.name);
            console.error('[Chatbot] Error message:', error.message);
            console.error('[Chatbot] Error stack:', error.stack);
            
            // More detailed error message based on error type
            let errorMessage = 'Sorry, I encountered an error while processing your request. Please try again later. / Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau. 🔧';
            
            if (error.message.startsWith('QUOTA_EXCEEDED:')) {
                const retryAfter = error.message.split(':')[1] || '24 hours';
                errorMessage = `⚠️ API Quota Exceeded / Đã vượt quá giới hạn API:

• The free API key has reached its daily limit / API key miễn phí đã đạt giới hạn ngày
• Please try again after ${retryAfter} / Vui lòng thử lại sau ${retryAfter}
• Consider upgrading to a paid API key / Cân nhắc nâng cấp lên API key trả phí

For more information / Để biết thêm thông tin:
https://ai.google.dev/gemini-api/docs/rate-limits`;
            } else if (error.message.includes('API request failed')) {
                errorMessage = `🚨 API Error / Lỗi API: ${error.message}`;
            } else if (error.message.includes('fetch')) {
                errorMessage = '🌐 Network Error: Unable to connect to Gemini API. Please check your internet connection. / Lỗi mạng: Không thể kết nối đến Gemini API. Vui lòng kiểm tra kết nối internet.';
            } else if (error.message.includes('timeout')) {
                errorMessage = '⏰ Request timeout. The API took too long to respond. Please try again. / Hết thời gian chờ. API phản hồi quá chậm. Vui lòng thử lại.';
            } else if (error.message.includes('JSON')) {
                errorMessage = '📄 Response format error. The API returned an unexpected response format. / Lỗi định dạng phản hồi. API trả về định dạng không mong đợi.';
            }
            
            addMessage(errorMessage, 'bot');
        } finally {
            // Hide typing indicator and re-enable input
            console.log('[Chatbot] Hiding typing indicator and re-enabling input');
            showTypingIndicator(false);
            setInputState(true);
            messageInput.focus();
            console.log('[Chatbot] Message handling completed');
        }
    }

    function addMessage(content, sender) {
        console.log(`[Chatbot] Adding ${sender} message to chat, content length: ${content.length}`);
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Ensure proper UTF-8 encoding for Vietnamese text
        try {
            // Fix Vietnamese encoding issues first
            let cleanContent = fixVietnameseEncoding(content);
            // Remove any potential null bytes or invisible characters
            cleanContent = cleanContent.replace(/\0/g, '').replace(/\u00A0/g, ' ').trim();
            // Ensure proper UTF-8 encoding
            contentDiv.textContent = cleanContent;
            console.log('[Chatbot] Text content set successfully, length:', cleanContent.length);
        } catch (error) {
            console.error('[Chatbot] Error setting text content:', error);
            contentDiv.textContent = content; // Fallback to original
        }
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        console.log('[Chatbot] Scrolled to bottom of chat');
        
        // Save to history
        console.log('[Chatbot] Saving message to chat history');
        saveChatHistory(content, sender);
    }

    function showTypingIndicator(show) {
        typingIndicator.style.display = show ? 'block' : 'none';
        if (show) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function setInputState(enabled) {
        messageInput.disabled = !enabled;
        sendButton.disabled = !enabled;
        
        if (enabled) {
            messageInput.focus();
        }
    }

    async function getMeetingContext() {
        console.log('[Chatbot] Getting meeting context from chrome.storage.local');
        return new Promise((resolve) => {
            chrome.storage.local.get([
                'transcript', 
                'chatMessages', 
                'meetingTitle', 
                'attendees', 
                'speakers',
                'meetingStartTimeStamp',
                'meetingEndTimeStamp'
            ], (result) => {
                console.log('[Chatbot] Storage data retrieved:', {
                    hasTranscript: result.transcript ? `${result.transcript.length} items` : 'none',
                    hasChatMessages: result.chatMessages ? `${result.chatMessages.length} items` : 'none',
                    meetingTitle: result.meetingTitle || 'none',
                    attendeesCount: result.attendees ? result.attendees.length : 0,
                    speakersCount: result.speakers ? result.speakers.length : 0,
                    hasStartTime: !!result.meetingStartTimeStamp,
                    hasEndTime: !!result.meetingEndTimeStamp
                });
                
                let context = "Current meeting context: ";
                
                if (result.meetingTitle) {
                    context += `Meeting title: ${result.meetingTitle}. `;
                }
                
                if (result.attendees && result.attendees.length > 0) {
                    context += `Attendees: ${result.attendees.join(', ')}. `;
                }
                
                if (result.speakers && result.speakers.length > 0) {
                    console.log('[Chatbot] Processing speakers:', result.speakers);
                    context += `Speakers: ${Array.from(result.speakers).join(', ')}. `;
                }
                
                if (result.transcript && result.transcript.length > 0) {
                    // Get last 5 transcript entries for context
                    const recentTranscripts = result.transcript.slice(-5);
                    console.log('[Chatbot] Using last 5 transcript entries out of', result.transcript.length);
                    context += "Recent transcript: ";
                    recentTranscripts.forEach(entry => {
                        context += `${entry.personName}: ${entry.personTranscript}. `;
                    });
                }
                
                if (result.chatMessages && result.chatMessages.length > 0) {
                    // Get last 3 chat messages for context
                    const recentChats = result.chatMessages.slice(-3);
                    console.log('[Chatbot] Using last 3 chat messages out of', result.chatMessages.length);
                    context += "Recent chat messages: ";
                    recentChats.forEach(entry => {
                        context += `${entry.personName}: ${entry.chatMessageText}. `;
                    });
                }
                
                console.log('[Chatbot] Final context length:', context.length);
                resolve(context);
            });
        });
    }

    async function callGeminiAPI(userMessage, context) {
        console.log('[Chatbot] callGeminiAPI function called');
        
        // Wait for config to load
        console.log('[Chatbot] Checking if CONFIG is loaded');
        if (!window.CONFIG) {
            console.log('[Chatbot] CONFIG not found, waiting...');
            let attempts = 0;
            const maxAttempts = 20; // Try for 2 seconds max
            
            while (!window.CONFIG && attempts < maxAttempts) {
                console.log(`[Chatbot] Waiting for CONFIG to load... Attempt ${attempts + 1}/${maxAttempts}`);
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (!window.CONFIG) {
                console.warn('[Chatbot] CONFIG failed to load after maximum attempts');
            } else {
                console.log('[Chatbot] CONFIG loaded after waiting');
            }
        } else {
            console.log('[Chatbot] CONFIG is already loaded');
        }

        console.log('[Chatbot] Getting configuration settings');
        const config = window.CONFIG || {};
        console.log('[Chatbot] CONFIG object available:', !!config);
        console.log('[Chatbot] CONFIG keys:', Object.keys(config));
        console.log('[Chatbot] CONFIG.GEMINI_API_URL:', config.GEMINI_API_URL);
        
        const GEMINI_API_KEY = config.GEMINI_API_KEY || 'AIzaSyAra7sySoUWq3ait9Y3kHnIdd_0ay_6kEY';
        const GEMINI_API_URL = config.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        
        // Mask key for logging
        const maskedKey = GEMINI_API_KEY ? 
            GEMINI_API_KEY.substring(0, 4) + '...' + GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 4) : 
            'none';
        
        console.log('[Chatbot] API URL:', GEMINI_API_URL);
        console.log('[Chatbot] API Key (masked):', maskedKey);
        console.log('[Chatbot] API Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
        console.log('[Chatbot] API Key provided:', GEMINI_API_KEY ? 'Yes' : 'No');

        // Check if API key is configured
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
            console.warn('[Chatbot] Invalid or placeholder API key detected');
            return "⚠️ Gemini API key is not configured. Please set up your API key in the config.js file to use this feature.\n\nInstructions:\n1. Get API key from https://makersuite.google.com/app/apikey\n2. Update config.js with your key";
        }

        const prompt = `
You are Ocean AI, a versatile and friendly chatbot that can engage in ANY conversation naturally. You are knowledgeable about all topics including games, movies, sports, technology, daily life, entertainment, science, history, and much more.

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
- Keep responses under 200 words and use a friendly, professional tone
- Answer directly and concisely without extra formatting
- Ensure proper character encoding for all languages

Meeting context (ONLY use if the question is specifically about meetings):
${context}

User question: ${userMessage}

Instructions: Analyze the user's question and respond naturally. If it's about meetings, use the context. If it's about anything else, ignore the meeting context completely and answer based on your general knowledge. Be enthusiastic and knowledgeable about all topics.`;

            // Create request body with optimized parameters
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,    // Increased for more creative responses
                    topK: 80,           // Increased for broader vocabulary
                    topP: 0.98,         // Increased for more diverse responses
                    maxOutputTokens: 750, // Increased for longer, more detailed responses
                    candidateCount: 1,
                    stopSequences: []
                }
            };
            
            console.log('[Chatbot] Request body structure:', JSON.stringify({
                contents: '[CONTENT_OBJECT]',
                generationConfig: requestBody.generationConfig
            }));
            
            // Set timeout for the request
            console.log('[Chatbot] Setting up request with timeout');
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.error('[Chatbot] API request timeout after 30 seconds');
                controller.abort();
            }, 30000);
            
            console.log('[Chatbot] Sending fetch request to Gemini API');
            const startTime = Date.now();
            const apiUrl = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
            const endTime = Date.now();
            console.log(`[Chatbot] Fetch completed in ${endTime - startTime}ms`);
            
            // Clear timeout since we got a response
            clearTimeout(timeoutId);
            
            console.log('[Chatbot] Response status:', response.status);
            console.log('[Chatbot] Response status text:', response.statusText);
            console.log('[Chatbot] Response headers:', JSON.stringify([...response.headers.entries()]));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Chatbot] API error response:', errorText);
                
                // Check for quota exceeded error
                if (response.status === 429) {
                    console.warn('[Chatbot] API quota exceeded');
                    let retryAfter = '24 hours'; // Default retry time
                    
                    try {
                        const errorData = JSON.parse(errorText);
                        // Try to get the actual retry delay from the error response
                        const retryInfo = errorData.error?.details?.find(d => d['@type']?.includes('RetryInfo'));
                        if (retryInfo?.retryDelay) {
                            retryAfter = retryInfo.retryDelay;
                        }
                    } catch (e) {
                        console.error('[Chatbot] Error parsing quota error details:', e);
                    }
                    
                    throw new Error(`QUOTA_EXCEEDED:${retryAfter}`);
                }
                
                throw new Error(`API request failed: ${response.status} - ${response.statusText}. Details: ${errorText.substring(0, 200)}`);
            }

            console.log('[Chatbot] Response received, parsing JSON');
            const responseText = await response.text();
            console.log('[Chatbot] Raw response text (first 100 chars):', responseText.substring(0, 100) + '...');
            
            // Check for encoding issues
            const hasUnicodeChars = /[^\x00-\x7F]/.test(responseText);
            console.log('[Chatbot] Response contains Unicode characters:', hasUnicodeChars);
            
            const data = JSON.parse(responseText);
            console.log('[Chatbot] Response JSON structure:', JSON.stringify({
                hasData: !!data,
                hasCandidates: !!(data && data.candidates),
                candidatesLength: data && data.candidates ? data.candidates.length : 0,
                hasContent: !!(data && data.candidates && data.candidates[0] && data.candidates[0].content)
            }));
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const responseContent = data.candidates[0].content;
                console.log('[Chatbot] Content structure:', JSON.stringify({
                    hasParts: !!responseContent.parts,
                    partsLength: responseContent.parts ? responseContent.parts.length : 0,
                    firstPartType: responseContent.parts && responseContent.parts[0] ? typeof responseContent.parts[0] : 'N/A',
                    hasText: !!(responseContent.parts && responseContent.parts[0] && responseContent.parts[0].text)
                }));
                
                if (responseContent.parts && responseContent.parts[0] && responseContent.parts[0].text) {
                    let finalText = responseContent.parts[0].text;
                    console.log('[Chatbot] Successfully extracted text from response, length:', finalText.length);
                    
                    // Fix Vietnamese encoding issues
                    finalText = fixVietnameseEncoding(finalText);
                    
                    // Clean up any remaining potential issues
                    try {
                        finalText = finalText.replace(/\0/g, '').replace(/\u00A0/g, ' ').trim();
                        console.log('[Chatbot] Final text after cleanup (first 100 chars):', finalText.substring(0, 100));
                    } catch (error) {
                        console.error('[Chatbot] Error cleaning text:', error);
                    }
                    
                    return finalText;
                } else {
                    console.error('[Chatbot] Missing text in response parts');
                    throw new Error('Invalid response format: Missing text in content parts');
                }
            } else {
                console.error('[Chatbot] Invalid response format:', JSON.stringify(data));
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('[Chatbot] Gemini API Error:', error);
            console.error('[Chatbot] Error name:', error.name);
            console.error('[Chatbot] Error message:', error.message);
            console.error('[Chatbot] Error stack:', error.stack);
            
            let errorMessage = 'Sorry, I encountered an error while processing your request. Please try again later. / Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau. 🔧';
            
            if (error.message.startsWith('QUOTA_EXCEEDED:')) {
                const retryAfter = error.message.split(':')[1] || '24 hours';
                errorMessage = `⚠️ API Quota Exceeded / Đã vượt quá giới hạn API:

• The free API key has reached its daily limit / API key miễn phí đã đạt giới hạn ngày
• Please try again after ${retryAfter} / Vui lòng thử lại sau ${retryAfter}
• Consider upgrading to a paid API key / Cân nhắc nâng cấp lên API key trả phí

For more information / Để biết thêm thông tin:
https://ai.google.dev/gemini-api/docs/rate-limits`;
            } else if (error.message.includes('API request failed')) {
                errorMessage = `🚨 API Error / Lỗi API: ${error.message}`;
            } else if (error.message.includes('fetch')) {
                errorMessage = '🌐 Network Error: Unable to connect to Gemini API. Please check your internet connection. / Lỗi mạng: Không thể kết nối đến Gemini API. Vui lòng kiểm tra kết nối internet.';
            } else if (error.message.includes('timeout')) {
                errorMessage = '⏰ Request timeout. The API took too long to respond. Please try again. / Hết thời gian chờ. API phản hồi quá chậm. Vui lòng thử lại.';
            } else if (error.message.includes('JSON')) {
                errorMessage = '📄 Response format error. The API returned an unexpected response format. / Lỗi định dạng phản hồi. API trả về định dạng không mong đợi.';
            }
            
            addMessage(errorMessage, 'bot');
        } finally {
            // Hide typing indicator and re-enable input
            console.log('[Chatbot] Hiding typing indicator and re-enabling input');
            showTypingIndicator(false);
            setInputState(true);
            messageInput.focus();
            console.log('[Chatbot] Message handling completed');
        }
    }

    // Add some sample interactions for demo purposes
    function addSampleMessages() {
        setTimeout(() => {
            addMessage("💡 You can ask me things like:", 'bot');
        }, 1000);
        
        setTimeout(() => {
            addMessage("• \"Summarize today's meeting\"", 'bot');
        }, 2000);
        
        setTimeout(() => {
            addMessage("• \"Who spoke the most?\"", 'bot');
        }, 3000);
        
        setTimeout(() => {
            addMessage("• \"What were the key decisions made?\"", 'bot');
        }, 4000);
    }

    // Uncomment the line below to show sample messages on load
    // addSampleMessages();
    
    // Initialize chat history
    loadChatHistory();
    
    // Test Vietnamese encoding on initialization
    function testVietnameseEncoding() {
        console.log('[Chatbot] Testing Vietnamese encoding...');
        const testText = 'Xin chào! Tôi là Ocean AI. Tôi có thể giúp bạn phân tích cuộc họp.';
        console.log('[Chatbot] Test text:', testText);
        console.log('[Chatbot] Test text length:', testText.length);
        console.log('[Chatbot] Test text bytes:', new TextEncoder().encode(testText).length);
        
        // Test fix function
        const fixedText = fixVietnameseEncoding(testText);
        console.log('[Chatbot] Fixed text:', fixedText);
        console.log('[Chatbot] Fixed text length:', fixedText.length);
        
        // Test display
        const testDiv = document.createElement('div');
        testDiv.style.display = 'none';
        testDiv.textContent = testText;
        document.body.appendChild(testDiv);
        console.log('[Chatbot] Test div text content:', testDiv.textContent);
        document.body.removeChild(testDiv);
        
        console.log('[Chatbot] Vietnamese encoding test completed');
    }

    // Add initial Vietnamese greeting
    function addInitialGreeting() {
        // Check if there are already messages in the chat to avoid duplicates
        const existingMessages = document.querySelectorAll('#chat-messages .message');
        if (existingMessages.length > 0) {
            console.log('[Chatbot] Messages already exist, skipping initial greeting');
            return;
        }
        
        setTimeout(() => {
            const greeting = 'Hi! I\'m your Ocean AI assistant. I can help you with questions about your meetings, transcripts, or anything else you\'d like to know! / Chào bạn! Mình là trợ lý Ocean AI của bạn. Mình có thể giúp bạn với các câu hỏi về cuộc họp, bản ghi âm, hoặc bất kỳ điều gì khác bạn muốn biết! ';
            addMessage(greeting, 'bot');
        }, 500);
    }

    // Run initialization functions
    testVietnameseEncoding();
    addInitialGreeting();
}

// Export functions for testing
window.OceanAIChatbot = {
    addMessage: function(content, sender) {
        // This is for external testing if needed
        return { content, sender };
    }
};

// Function to load chat history from storage
function loadChatHistory() {
    console.log('[Chatbot] Loading chat history from storage');
    chrome.storage.local.get(['chatHistory'], (result) => {
        if (result.chatHistory && result.chatHistory.length > 0) {
            console.log(`[Chatbot] Found ${result.chatHistory.length} history items to restore`);
            // Don't restore history for now to avoid duplicates
            // result.chatHistory.forEach(message => {
            //     addMessage(message.content, message.sender);
            // });
            console.log('[Chatbot] Chat history loading skipped to avoid duplicates');
        } else {
            console.log('[Chatbot] No chat history found in storage');
        }
    });
}

// Function to save chat history to storage
function saveChatHistory(content, sender) {
    console.log(`[Chatbot] Saving ${sender} message to chat history`);
    chrome.storage.local.get(['chatHistory'], (result) => {
        const history = result.chatHistory || [];
        console.log(`[Chatbot] Current history length: ${history.length}`);
        
        // Create new message entry
        const newMessage = { 
            content, 
            sender, 
            timestamp: Date.now() 
        };
        history.push(newMessage);
        
        // Keep only last 50 messages
        if (history.length > 50) {
            console.log(`[Chatbot] History exceeds 50 items, trimming to latest 50`);
            history.splice(0, history.length - 50);
        }
        
        // Save updated history
        console.log(`[Chatbot] Saving updated history with ${history.length} items`);
        chrome.storage.local.set({ chatHistory: history }, () => {
            if (chrome.runtime.lastError) {
                console.error('[Chatbot] Error saving chat history:', chrome.runtime.lastError);
            } else {
                console.log('[Chatbot] Chat history saved successfully');
            }
        });
    });
}

// Function to fix Vietnamese encoding issues
function fixVietnameseEncoding(text) {
    console.log('[Chatbot] Fixing Vietnamese encoding for text length:', text.length);
    try {
        // Common Vietnamese encoding fixes
        let fixedText = text
            .replace(/Ã¡/g, 'á').replace(/Ã /g, 'à').replace(/áº£/g, 'ả')
            .replace(/Ãµ/g, 'ã').replace(/áº¡/g, 'ạ').replace(/Ä/g, 'ă')
            .replace(/áº¯/g, 'ắ').replace(/áº±/g, 'ằ').replace(/áº³/g, 'ẳ')
            .replace(/áº¯/g, 'ẵ').replace(/áº¡/g, 'ặ').replace(/Ã¢/g, 'â')
            .replace(/áº¥/g, 'ấ').replace(/áº§/g, 'ầ').replace(/áº©/g, 'ẩ')
            .replace(/áº«/g, 'ẫ').replace(/áº­/g, 'ậ').replace(/Ã©/g, 'é')
            .replace(/Ã¨/g, 'è').replace(/áº»/g, 'ẻ').replace(/áº½/g, 'ẽ')
            .replace(/áº¹/g, 'ẹ').replace(/Ãª/g, 'ê').replace(/áº¿/g, 'ế')
            .replace(/áº¼/g, 'ề').replace(/áº¸/g, 'ể').replace(/áº¾/g, 'ễ')
            .replace(/áº¹/g, 'ệ').replace(/Ã­/g, 'í').replace(/Ã¬/g, 'ì')
            .replace(/áº¹/g, 'ỉ').replace(/Ä©/g, 'ĩ').replace(/áº¹/g, 'ị')
            .replace(/Ã³/g, 'ó').replace(/Ã²/g, 'ò').replace(/áº»/g, 'ỏ')
            .replace(/Ãµ/g, 'õ').replace(/áº¹/g, 'ọ').replace(/Ã´/g, 'ô')
            .replace(/áº¿/g, 'ố').replace(/áº¿/g, 'ồ').replace(/áº¿/g, 'ổ')
            .replace(/áº¿/g, 'ỗ').replace(/áº¿/g, 'ộ').replace(/Æ¡/g, 'ơ')
            .replace(/áº¿/g, 'ớ').replace(/áº¿/g, 'ờ').replace(/áº¿/g, 'ở')
            .replace(/áº¿/g, 'ỡ').replace(/áº¿/g, 'ợ').replace(/Ãº/g, 'ú')
            .replace(/Ã¹/g, 'ù').replace(/áº¿/g, 'ủ').replace(/Å©/g, 'ũ')
            .replace(/áº¿/g, 'ụ').replace(/Æ°/g, 'ư').replace(/áº¿/g, 'ứ')
            .replace(/áº¿/g, 'ừ').replace(/áº¿/g, 'ử').replace(/áº¿/g, 'ữ')
            .replace(/áº¿/g, 'ự').replace(/Ã½/g, 'ý').replace(/áº¿/g, 'ỳ')
            .replace(/áº¿/g, 'ỷ').replace(/áº¿/g, 'ỹ').replace(/áº¿/g, 'ỵ')
            .replace(/Ä/g, 'Đ').replace(/Ä/g, 'đ');
        
        // Remove any remaining null bytes or non-printable characters
        fixedText = fixedText.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        
        console.log('[Chatbot] Text after encoding fix (first 100 chars):', fixedText.substring(0, 100));
        return fixedText;
    } catch (error) {
        console.error('[Chatbot] Error fixing encoding:', error);
        return text; // Return original if fix fails
    }
}
