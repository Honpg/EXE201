// background.js

/**
 * Parse custom timestamp string into a Date object.
 * Handles various formats and falls back to current date if parsing fails.
 */
function parseCustomTimestamp(timestamp) {
  // 1. Guard Clause: Handle null, undefined, or non-string inputs
  if (typeof timestamp !== 'string' || !timestamp.trim()) {
    console.warn('Invalid or missing timestamp provided. Using current date as a fallback.');
    return new Date();
  }

  // 2. Try parsing as ISO 8601 (e.g. "2025-06-09T10:42:18.000Z")
  const isoDate = new Date(timestamp);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  // 3. Try parsing format: "09/06/2025, 17:42:18"
  if (timestamp.includes(',')) {
    try {
      const [datePart, timePart] = timestamp.split(', ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes, seconds = 0] = timePart.split(':').map(Number);
      const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    } catch (e) {}
  }

  // 4. Try parsing "17-42-18 09-06-2025"
  if (timestamp.includes(' ') && timestamp.includes('-')) {
    try {
      const [timeStr, dateStr] = timestamp.split(' ');
      const [hours, minutes, seconds = 0] = timeStr.split('-').map(Number);
      const [day, month, year] = dateStr.split('-').map(Number);
      const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    } catch (e) {}
  }

  console.warn(`Could not parse timestamp in any known format: "${timestamp}". Using current date.`);
  return new Date();
}

/**
 * Helper to read values from chrome.storage.local using Promises.
 */
function getStorage(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(result);
    });
  });
}

/**
 * Store a new chat message in chrome.storage.local.
 */
function storeChatMessage(userMessage, botResponse) {
  const chatEntry = {
    timestamp: new Date().toISOString(),
    userMessage: userMessage,
    botResponse: botResponse
  };

  chrome.storage.local.get({ chatHistory: [] }, (result) => {
    const chatHistory = result.chatHistory;
    chatHistory.push(chatEntry);

    // Limit to last 50 entries
    if (chatHistory.length > 50) {
      chatHistory.shift();
    }

    chrome.storage.local.set({ chatHistory }, () => {
      console.log('Chat message stored:', chatEntry);
    });
  });
}

/**
 * Remove chatHistory from storage.
 */
function clearChatHistory() {
  chrome.storage.local.remove('chatHistory', () => {
    console.log('Chat history cleared from storage.');
  });
}

/**
 * Send meeting data to backend API.
 */
async function sendToBackend() {
  try {
    // Get all relevant data
    const result = await getStorage([
      "userName", "transcript", "chatMessages", "meetingTitle",
      "meetingStartTimeStamp", "meetingEndTimeStamp", "attendees",
      "speakers", "oauthEmail", "oauthName", "chatHistory"
    ]);

    console.log("Storage data:", result);

    if (!result.oauthEmail || !result.oauthName) {
      console.error("Missing oauthEmail or oauthName in storage, aborting send.");
      return;
    }

    if (!result.userName || !result.transcript || !result.chatMessages) {
      console.warn("Missing transcript or chat messages, skipping send.");
      return;
    }

    const lines = [];
    const averageWPM = 170;
    const speakerDuration = {};

    result.transcript.forEach(entry => {
      const wordCount = entry.personTranscript.split(' ').length;
      const durationInSeconds = Math.round((wordCount / averageWPM) * 60);
      const transcriptEntry = {
        name: (entry.personName === "You" ? result.userName : entry.personName),
        timeStamp: parseCustomTimestamp(entry.timeStamp),
        type: "transcript",
        duration: durationInSeconds,
        content: entry.personTranscript
      };
      lines.push(transcriptEntry);
      const speakerName = transcriptEntry.name;
      speakerDuration[speakerName] = (speakerDuration[speakerName] || 0) + transcriptEntry.duration;
    });

    result.chatMessages.forEach(entry => {
      lines.push({
        name: (entry.personName === "You" ? result.userName : entry.personName),
        timeStamp: parseCustomTimestamp(entry.timeStamp),
        type: "chat",
        duration: 0,
        content: entry.chatMessageText
      });
    });

    // Collect all unique speakers from transcript
    const allSpeakerNames = new Set();
    lines.forEach(line => {
      if (line.type === "transcript") {
        const name = line.name?.trim();
        if (name) allSpeakerNames.add(name);
      }
    });
    const speakersArray = Array.from(allSpeakerNames);

    // Register user first
    const registerRes = await fetch('http://localhost:3000/api/register-from-extension', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: result.oauthEmail,
        name: result.oauthName
      })
    });

    if (!registerRes.ok) {
      const errData = await registerRes.json();
      console.warn("Register user failed:", errData.message);
      if (registerRes.status !== 409) {
        console.error("Aborting due to register failure.");
        return;
      }
    } else {
      console.log("User registered or already exists.");
    }

    // Send meeting data
    const meetRes = await fetch('http://localhost:3000/api/meet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        oceanAiEmail: result.oauthEmail,
        oceanAiName: result.oauthName,
        chatHistory: result.chatHistory || [],
        convenor: result.userName,
        meetingTitle: result.meetingTitle || "Untitled Meeting",
        meetingStartTimeStamp: parseCustomTimestamp(result.meetingStartTimeStamp)?.toISOString() || new Date().toISOString(),
        meetingEndTimeStamp: parseCustomTimestamp(result.meetingEndTimeStamp)?.toISOString() || undefined,
        speakers: speakersArray,
        attendees: result.attendees?.filter(att => !att.includes("(Presentation)")) || [],
        transcriptData: lines,
        speakerDuration
      })
    });

    if (!meetRes.ok) {
      const errData = await meetRes.json();
      console.error("Failed to save meeting:", errData.message);
      return;
    }

    const data = await meetRes.json();
    console.log('📤 Meeting saved to backend:', data);

  } catch (error) {
    console.error("Error in sendToBackend:", error);
  }
}

/**
 * Handle extension install → login OAuth flow and open welcome page.
 */
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Extension installed. Starting authentication...");

  try {
    const token = await new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError || !token) {
          reject(chrome.runtime.lastError?.message || "Token was not provided.");
        } else {
          resolve(token);
        }
      });
    });
    console.log("Successfully retrieved Google token.");

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!userInfoResponse.ok) throw new Error("Failed to fetch user info from Google.");

    const userInfo = await userInfoResponse.json();
    console.log("Successfully fetched user info:", userInfo);

    await new Promise((resolve, reject) => {
      chrome.storage.local.set({
        oauthEmail: userInfo.email,
        oauthName: userInfo.name
      }, () => {
        if (chrome.runtime.lastError) reject("Failed to save user info to storage.");
        else resolve();
      });
    });

    console.log("User info saved to storage.");

    // Register user
    const registerResponse = await fetch('http://localhost:3000/api/register-from-extension', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userInfo.email,
        name: userInfo.name
      })
    });

    if (!registerResponse.ok) throw new Error("Failed to register user with backend.");

    const result = await registerResponse.json();
    console.log("User registered with backend:", result);

    chrome.tabs.create({ url: 'http://localhost:5173' });

  } catch (error) {
    console.error("--- Error during onInstalled process ---");
    console.error(error);
  }
});

/**
 * Handle various extension messages.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "chatbot_query") {
    sendResponse({ success: true, message: "Chatbot query received" });
    return true;
  }

  if (message.type === "new_meeting_started") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0]?.id;
      if (tabId) {
        chrome.storage.local.set({ meetingTabId: tabId }, function () {
          console.log("✅ Meeting tab id saved");
        });
      }
    });
    return true;
  }

  if (message.type === "end_meeting") {
    chrome.storage.local.set({ meetingTabId: null }, function () {
      console.log("🧹 Meeting tab id cleared");
    });
    sendToBackend();
    clearChatHistory();
    sendResponse({ success: true });
    return true;
  }

  return false;
});

// Handle tab closed
chrome.tabs.onRemoved.addListener(function (tabid) {
  chrome.storage.local.get(["meetingTabId"], function (data) {
    if (tabid == data.meetingTabId) {
      console.log("Tab closed → sending meeting data.");
      sendToBackend();
      chrome.storage.local.set({ meetingTabId: null }, function () {
        console.log("Meeting tab id cleared for next meeting.");
      });
    }
  });
});
