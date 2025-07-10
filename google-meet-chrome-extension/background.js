chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed or updated!");
    
    // Sử dụng chrome.identity.getAuthToken nhưng với xử lý lỗi chi tiết hơn
    chrome.identity.getAuthToken({ 
        interactive: true,
        // Đặt lại scope nếu cần
        scopes: ["https://www.googleapis.com/auth/userinfo.email", 
                 "https://www.googleapis.com/auth/userinfo.profile"]
    }, function (token) {
        console.log("Auth token attempt, result:", token ? "Token received" : "No token");
        
        if (chrome.runtime.lastError) {
            console.error("Auth error details:", chrome.runtime.lastError);
            // Hiển thị lỗi chi tiết để debug
            if (chrome.runtime.lastError.message) {
                console.error("Error message:", chrome.runtime.lastError.message);
            }
            return;
        }
        
        if (!token) {
            console.error("No token received despite no error");
            return;
        }

        // Fetch user info
        console.log("Fetching user info with token");
        fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(response => {
            console.log("User info response status:", response.status);
            return response.json();
        })
        .then(data => {
            console.log("Received user data:", data);
            // Store user information in Chrome storage
            chrome.storage.local.set({ 
                oauthEmail: data.email,
                oauthName: data.name 
            }, function() {
                console.log("Stored in Chrome storage:", data.email, data.name);
                console.log('User information stored in Chrome storage.');

                // Make fetch request to your API endpoint
                fetch('http://localhost:3000/api/register-from-extension', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: data.email,
                        name: data.name
                    })
                })
                .then(result => {
                    console.log('User registered:', result);
                })
                .catch(error => {
                    console.error('Error registering user:', error);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });
    });

    chrome.tabs.create({
        url: 'http://localhost:5173/welcome' // Replace with your desired URL
      });

});

function downloadScreenshot(dataUrl) {
    chrome.downloads.download({
      url: dataUrl,
      filename: 'screenshot.png',
      saveAs: false  // Automatically save to the Downloads folder without user prompt
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        alert('Error downloading screenshot: ' + chrome.runtime.lastError.message);
      } else {
        chrome.downloads.search({ id: downloadId }, (results) => {
        //   if (results && results.length > 0) {
        //     alert('Screenshot captured and saved to: ' + results[0].filename);
        //   } else {
        //     alert('Screenshot captured, but could not retrieve the download path.');
        //   }
        });
      }
    });
}

function clearChatHistory() {
    chrome.storage.local.remove('chatHistory', () => {
      console.log('Chat history cleared from storage.');
    });
}
}



// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "capture_screenshot") {
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//           const currentTab = tabs[0];
      
//           // Regular expression to match Google Meet URLs with a meet ID
//         //   const meetUrlRegex = /^https:\/\/meet\.google\.com\/([a-z]{3}-[a-z]{4}-[a-z]{3})$/;
//         const meetUrlRegex = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}(\?.*)?$/;

      
//           // Check if the current tab's URL matches Google Meet and contains a valid meet ID
//           if (meetUrlRegex.test(currentTab.url)) {
//             chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
//               if (chrome.runtime.lastError || !dataUrl) {
//                 alert('Failed to capture screenshot: ' + (chrome.runtime.lastError?.message || 'Unknown error.'));
//                 sendResponse({ success: false }); // Indicate failure
//               } else {
//                 downloadScreenshot(dataUrl);
//                 storeScreenshotUrl(dataUrl); // Store the screenshot URL
//                 sendResponse({ success: true }); // Indicate success
//               }
//             });
//             return true; // Keep the messaging channel open for asynchronous response
//           } else {
//             sendResponse({ success: false }); // Not a valid Google Meet page
//           }
//         });
//       }      

//     if (message.type == "new_meeting_started") {
//         chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//             const tabId = tabs[0].id
//             chrome.storage.local.set({ meetingTabId: tabId }, function () {
//                 console.log("Meeting tab id saved")
//             })
//         })
//     }
//     if (message.type == "end_meeting") {
//         chrome.storage.local.set({ meetingTabId: null }, function () {
//             console.log("Meeting tab id cleared")
//         })
//         sendToBackend()
//         clearScreenshots()
//     }
//     return true
//   });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // ✅ Handle chatbot requests
  if (message.action === "chatbot_query") {
    // This can be extended to handle specific chatbot queries if needed
    sendResponse({ success: true, message: "Chatbot query received" });
    return true;
  }

  // ✅ Save meeting tab ID
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

  // ✅ End meeting and cleanup
  if (message.type === "end_meeting") {
    chrome.storage.local.set({ meetingTabId: null }, function () {
      console.log("🧹 Meeting tab id cleared");
    });
    sendToBackend(); // ✅ Send transcript/chat to server
    clearChatHistory(); // ✅ Clear chat history instead of screenshots
    sendResponse({ success: true });
    return true;
  }

  return false; // default fallback
});


// Chat history management functions
function storeChatMessage(userMessage, botResponse) {
    const chatEntry = {
        timestamp: new Date().toISOString(),
        userMessage: userMessage,
        botResponse: botResponse
    };

    chrome.storage.local.get({ chatHistory: [] }, (result) => {
        const chatHistory = result.chatHistory;
        chatHistory.push(chatEntry);

        // Limit chat history to last 50 entries
        if (chatHistory.length > 50) {
            chatHistory.shift();
        }

        chrome.storage.local.set({ chatHistory: chatHistory }, () => {
            console.log('Chat message stored:', chatEntry);
        });
    });
}
  

  chrome.tabs.onRemoved.addListener(function (tabid) {
    chrome.storage.local.get(["meetingTabId"], function (data) {
        if (tabid == data.meetingTabId) {
            console.log("Successfully intercepted tab close")
            sendToBackend()
            clearChatHistory() // Clear chat history instead of screenshots
            chrome.storage.local.set({ meetingTabId: null }, function () {
                console.log("Meeting tab id cleared for next meeting")
            })
        }
    })
})
function parseCustomTimestamp(timestamp,isFringe) {
    const [datePart, timePart] = timestamp.split(', ');

    const [day, month, year] = (isFringe ? datePart.split('-').map(Number) :  datePart.split('/').map(Number)) 
    const [time, period] = timePart.split(' ');
    let [hours, minutes, seconds] = (isFringe ? time.split('-').map(Number) : time.split(':').map(Number));

    if (seconds === undefined) {
        seconds = 0;
    }

    const dateObject = new Date(year, month - 1, day, hours, minutes, seconds);

    // 4.1. Thử định dạng "HH-mm-ss DD-MM-YYYY"
    if (timestamp.match(/^\d{2}-\d{2}-\d{2} \d{2}-\d{2}-\d{4}$/)) {
        try {
            const [timeStr, dateStr] = timestamp.split(' ');
            const [hours, minutes, seconds] = timeStr.split('-').map(Number);
            const [day, month, year] = dateStr.split('-').map(Number);
            const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate;
            }
        } catch (e) {
            console.warn(`Error parsing timestamp in format HH-mm-ss DD-MM-YYYY: ${e.message}`);
        }
    }

    // 5. Fallback: If no known format is matched, return the current date
    console.warn(`Could not parse timestamp in any known format: "${timestamp}". Using current date.`);
    return new Date();
}

// function sendToBackend() {
//     chrome.storage.local.get(["userName", "transcript", "chatMessages", "meetingTitle", "meetingStartTimeStamp", "meetingEndTimeStamp", "attendees", "speakers","oauthEmail", "oauthName", "screenshots"], function (result) {
//         console.log(result);
//         const speakerDuration={};
        
//         if (result.userName && result.transcript && result.chatMessages) {
//             const lines = [];
//             const averageWPM = 170;
            
//             result.transcript.forEach(entry => {
//                 const wordCount = entry.personTranscript.split(' ').length;
//                 const durationInSeconds = Math.round((wordCount / averageWPM) * 60); 
//                 const transcriptEntry = {
//                     name: (entry.personName == "You" ? result.userName : entry.personName),
//                     timeStamp: parseCustomTimestamp(entry.timeStamp, false),
//                     type: "transcript",
//                     duration: durationInSeconds,
//                     content: entry.personTranscript
//                 };
                
//                 lines.push(transcriptEntry);
//                 const speakerName = transcriptEntry.name;
//                 if (speakerDuration[speakerName])    speakerDuration[speakerName] += transcriptEntry.duration;
//                 else speakerDuration[speakerName] = transcriptEntry.duration;
                
//             });

//             if (result.chatMessages.length > 0) {
//                 result.chatMessages.forEach(entry => {
//                     lines.push({
//                         name: (entry.personName=="You" ?  result.userName :  entry.personName),
//                         timeStamp: parseCustomTimestamp(entry.timeStamp, false),
//                         type: "chat",
//                         duration: 0, // chat msgs don't count as spoken time
//                         content: entry.personTranscript
//                     });
//                 });
//             }

//             console.log(result.speakers, result.attendees)
//             const speakersArray = Array.from(result.speakers || []).map(speaker => speaker.trim()).filter(speaker => speaker !== "");
//             // Đảm bảo người dùng được đăng ký trước khi gửi cuộc họp
// await fetch('http://localhost:3000/api/register-from-extension', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//         email: result.oauthEmail,
//         name: result.oauthName
//     })
// });

//             fetch('http://localhost:3000/api/meet', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     oceanAiEmail: result.oauthEmail,
//                     oceanAiName: result.oauthName,
//                     screenshots: result.screenshots,
//                     convenor: result.userName,
//                     meetingTitle: result.meetingTitle || "Untitled Meeting",
//                     meetingStartTimeStamp: parseCustomTimestamp(result.meetingStartTimeStamp, true) || new Date().toISOString(),
//                     meetingEndTimeStamp: parseCustomTimestamp(result.meetingEndTimeStamp,true) || undefined,
//                     speakers: speakersArray,
//                     attendees: result.attendees.filter(attendee => !(attendee.includes("(Presentation)"))),
//                     transcriptData: lines,
//                     speakerDuration
//                 }),
//             })
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Success:', data);
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//             });
//         } else {
//             console.log("No transcript found");
//         }
//     });
// }
  
// Hàm Promise để lấy dữ liệu từ chrome.storage.local
function getStorage(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(result);
    });
  });
}

chrome.storage.local.get(['oauthEmail', 'oauthName'], (res) => {
  console.log('Current OAuth data:', res);
});


async function sendToBackend() {
  try {
    // Lấy dữ liệu cần thiết từ storage
    const result = await getStorage([
      "userName", "transcript", "chatMessages", "meetingTitle",
      "meetingStartTimeStamp", "meetingEndTimeStamp", "attendees",
      "speakers", "oauthEmail", "oauthName", "chatHistory"
    ]);

    console.log("Storage data:", result);

    // Kiểm tra bắt buộc có email và tên để đăng ký user
    if (!result.oauthEmail || !result.oauthName) {
      console.error("Missing oauthEmail or oauthName in storage, aborting send.");
      return;
    }

    if (!result.userName || !result.transcript || !result.chatMessages) {
      console.warn("Missing transcript or chat messages, skipping send.");
      return;
    }

    // Tính toán tổng hợp transcript và speakerDuration
    const lines = [];
    const averageWPM = 170;
    const speakerDuration = {};

    result.transcript.forEach(entry => {
      const wordCount = entry.personTranscript.split(' ').length;
      const durationInSeconds = Math.round((wordCount / averageWPM) * 60);
      const transcriptEntry = {
        name: (entry.personName === "You" ? result.userName : entry.personName),
        timeStamp: parseCustomTimestamp(entry.timeStamp, false),
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
        timeStamp: parseCustomTimestamp(entry.timeStamp, false),
        type: "chat",
        duration: 0,
        content: entry.chatMessageText
      });
    });

   // ✅ Thu thập speakers trực tiếp từ transcript
        const allSpeakerNames = new Set();

        lines.forEach(line => {
          if (line.type === "transcript") {
            const name = line.name?.trim();
            if (name && name !== "") {
              allSpeakerNames.add(name);
            }
          }
        });

        const speakersArray = Array.from(allSpeakerNames);


    // Đăng ký user (nếu chưa tồn tại)
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
      if (registerRes.status !== 409) { // 409 = User đã tồn tại, có thể bỏ qua
        console.error("Aborting due to register failure.");
        return;
      }
    } else {
      console.log("User registered or already exists.");
    }



    // Gửi dữ liệu meeting
    const meetRes = await fetch('http://localhost:3000/api/meet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oceanAiEmail: result.oauthEmail,
        oceanAiName: result.oauthName,
        chatHistory: result.chatHistory || [], // Include chat history instead of screenshots
        convenor: result.userName,
        meetingTitle: result.meetingTitle || "Untitled Meeting",
        meetingStartTimeStamp: parseCustomTimestamp(result.meetingStartTimeStamp, true) || new Date().toISOString(),
        meetingEndTimeStamp: parseCustomTimestamp(result.meetingEndTimeStamp, true) || undefined,
        speakers: speakersArray,
        attendees: result.attendees.filter(attendee => !(attendee.includes("(Presentation)"))),
        transcriptData: lines,
        speakerDuration
      }),
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



  function parseCustomTimestamp(timestamp) {
  try {
    // Convert "12:45:24 20/06/2025" to "2025-06-20T12:45:24"
    const [time, date] = timestamp.split(' ');
    const [day, month, year] = date.split('/');
    const isoFormat = `${year}-${month}-${day}T${time}`;

    // Parse the ISO format timestamp
    const parsedDate = new Date(isoFormat);

    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid timestamp format: ${timestamp}`);
    }

    return parsedDate;
  } catch (error) {
    console.error(`Could not parse timestamp in any known format: "${timestamp}". Using current date.`);
    return new Date();
  }
}

// Example usage
const timestamp = "12:45:24 20/06/2025";
const parsedDate = parseCustomTimestamp(timestamp);
console.log("Parsed date:", parsedDate);

function formatToVietnameseDate(date) {
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return formatter.format(date);
}

function formatToVietnameseDateManual(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Example usage
const date = new Date();
console.log("Formatted date (Intl):", formatToVietnameseDate(date));
console.log("Formatted date (Manual):", formatToVietnameseDateManual(date));