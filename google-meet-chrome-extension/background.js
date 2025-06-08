chrome.runtime.onInstalled.addListener(() => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        if (chrome.runtime.lastError || !token) {
            console.log("Token", token);
            console.error(chrome.runtime.lastError);
            return;
        }

        // Fetch user info
        fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(response => response.json())
        .then(data => {
            // Store user information in Chrome storage
            chrome.storage.local.set({ 
                oauthEmail: data.email,
                oauthName: data.name 
            }, function() {
                console.log(data.email, data.name);
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
  if (message.action === "capture_screenshot") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const meetUrlRegex = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}(\?.*)?$/;

      if (meetUrlRegex.test(currentTab.url)) {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
          if (chrome.runtime.lastError || !dataUrl) {
            alert('❌ Failed to capture screenshot: ' + (chrome.runtime.lastError?.message || 'Unknown error.'));
            sendResponse({ success: false });
          } else {
            downloadScreenshot(dataUrl);
            storeScreenshotUrl(dataUrl);
            sendResponse({ success: true });
          }
        });
      } else {
        sendResponse({ success: false, message: "❌ Not a valid Google Meet page." });
      }
    });

    return true; // ✅ Keep async messaging channel open
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
    sendToBackend(); // ✅ Send transcript/chat to server (implement separately)
    clearScreenshots(); // ✅ Cleanup function
    sendResponse({ success: true });
    return true;
  }

  return false; // default fallback
});


//   function storeScreenshotUrl(dataUrl) {
//     chrome.storage.local.get({ screenshots: [] }, (result) => {
//       const screenshots = result.screenshots;
//       screenshots.push(dataUrl); // Add the new screenshot URL to the array
  
//     //   // Optionally limit the number of stored screenshots
//     //   if (screenshots.length > 10) {
//     //     screenshots.shift(); // Remove the oldest screenshot if exceeding limit
//     //   }
  
//       // Save the updated array back to storage
//       chrome.storage.local.set({ screenshots: screenshots }, () => {
//         console.log('Screenshots updated in storage:', screenshots);
//       });
//     });
//   }
  
function storeScreenshotUrl(dataUrl) {
    // Generate a unique filename using the current timestamp
    const uniqueFilename = `screenshot_${Date.now()}.png`;

    // Fetch the blabberEmail from Chrome storage
    chrome.storage.local.get('oauthEmail', (result) => {
        const blabberEmail = result.oauthEmail;

        if (blabberEmail) {
            // Prepare the data to send to your backend
            const payload = {
                filename: uniqueFilename,
                imageData: dataUrl,
                email: blabberEmail // Include the email in the payload
            };

            // Make a network request to your backend to send the image
            fetch('http://localhost:3000/api/upload-screenshot', { // Replace with your actual backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Screenshot sent to backend successfully:', data);
                // Update the screenshots array in Chrome storage
                updateScreenshotsInStorage(uniqueFilename, blabberEmail);
            })
            .catch((error) => {
                console.error('Error sending screenshot to backend:', error);
            });
        } else {
            console.error('blabberEmail not found in storage.');
        }
    });
}

// Function to update the screenshots array in Chrome storage
function updateScreenshotsInStorage(uniqueFilename, blabberEmail) {
    const timestamp = new Date().toISOString();
    console.log(uniqueFilename)
    const screenshotEntry = {
        filename: `${uniqueFilename}`,
        timestamp: timestamp,
        takenBy: blabberEmail
    };

    chrome.storage.local.get({ screenshots: [] }, (result) => {
        const screenshots = result.screenshots;
        screenshots.push(screenshotEntry); // Add new screenshot entry

        // Save the updated array back to storage
        chrome.storage.local.set({ screenshots: screenshots }, () => {
            console.log('Screenshots updated in storage:', screenshots);
        });
    });
}
  

  chrome.tabs.onRemoved.addListener(function (tabid) {
    chrome.storage.local.get(["meetingTabId"], function (data) {
        if (tabid == data.meetingTabId) {
            console.log("Successfully intercepted tab close")
            sendToBackend()
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

    return dateObject
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
//                         content: entry.chatMessageText
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
//                     blabberEmail: result.oauthEmail,
//                     blabberName: result.oauthName,
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
      "speakers", "oauthEmail", "oauthName", "screenshots"
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
        blabberEmail: result.oauthEmail,
        blabberName: result.oauthName,
        screenshots: result.screenshots,
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




function clearScreenshots() {
    chrome.storage.local.remove('screenshots', () => {
      console.log('Screenshots cleared from storage.');
    });
  }