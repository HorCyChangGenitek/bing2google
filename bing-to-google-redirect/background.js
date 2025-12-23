/* global chrome */

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Bing to Google Redirect installed.");

  if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.isRegexSupported) {
    try {
      const result = await chrome.declarativeNetRequest.isRegexSupported({
        regex: "^https?:\\/\\/(?:www\\.)?bing\\.com\\/search\\?.*q=([^&]+).*$"
      });
      console.log("isRegexSupported:", result);
    } catch (e) {
      console.log("isRegexSupported check failed:", e);
    }
  }
});
