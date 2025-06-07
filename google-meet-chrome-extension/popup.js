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

window.onload = function () {
  fetch("http://localhost:3000/api/users/check", {
    method: "GET",
    credentials: "include" // ⚠️ rất quan trọng để gửi cookie
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
};


document.getElementById('view-meetings').addEventListener('click', function () {
  chrome.tabs.create({ url: 'http://localhost:5173/dashboard' });
});


document.getElementById('screenshot-btn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // chrome.scripting.executeScript({
    //   target: { tabId: tabs[0].id },
    //   func: captureScreenshot
    // }, (results) => {
    //   if (chrome.runtime.lastError) {
    //     alert('Error capturing screenshot: ' + chrome.runtime.lastError.message);
    //   } else {
    //     if (results && results[0] && results[0].result) {
    //       alert('Screenshot capture initiated.');
    //     }
    //   }
    // });
    chrome.runtime.sendMessage({ action: "capture_screenshot" }, (response) => {
  if (response?.success) {
    alert("Screenshot captured and uploaded!");
  } else {
    alert("Failed to capture screenshot.");
  }
});

  });
});

function captureScreenshot() {
  chrome.runtime.sendMessage({ action: "capture_screenshot" }, (response) => {
    return response; // Return the response to indicate whether it's initiated
  });
}
