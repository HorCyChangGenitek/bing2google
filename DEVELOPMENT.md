# Bing -> Google Redirect (Edge Extension, MV3)

## 0. Goal
When a user navigates to:
- https://www.bing.com/search?q=... (and any extra params)

Redirect to:
- https://www.google.com/search?q=...

Only the `q` parameter is preserved (as-is). Other parameters are ignored.

Examples:
- Bing:    https://www.bing.com/search?q=change%20bing%20to%20google&form=QBRE&...
- Google:  https://www.google.com/search?q=change%20bing%20to%20google

Note: Google accepts `%20` for spaces, so we do not need to convert to `+`.

## 1. Non-goals
- Not changing Edge settings.
- Not touching omnibox default search engine setting.
- Only redirecting actual URL navigations to Bing search endpoints.

## 2. Approach (Manifest V3)
Use `declarativeNetRequest` redirect rules:
- Match `https://www.bing.com/search?...q=...`
- Extract `q` value with `regexFilter`
- Redirect using `regexSubstitution` to `https://www.google.com/search?q=<captured>`

Docs:
- declarativeNetRequest API (rules/redirect) :contentReference[oaicite:1]{index=1}
- Redirect rules typically require host permissions :contentReference[oaicite:2]{index=2}
- Regex support utilities exist (isRegexSupported on some platforms) :contentReference[oaicite:3]{index=3}

## 3. Repository layout
bing-to-google-redirect/
  ├─ manifest.json
  ├─ background.js
  └─ rules/
       └─ ruleset.json

## 4. Files

### 4.1 manifest.json
```json
{
  "manifest_version": 3,
  "name": "Bing to Google Redirect",
  "version": "0.1.0",
  "description": "Redirects Bing search URLs to Google, preserving only the q parameter.",
  "permissions": ["declarativeNetRequest"],
  "host_permissions": [
    "*://www.bing.com/*",
    "*://bing.com/*",
    "*://www.google.com/*",
    "*://google.com/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "declarative_net_request": {
    "rule_resources": [
      {
        "id": "ruleset_1",
        "enabled": true,
        "path": "rules/ruleset.json"
      }
    ]
  },
  "action": {
    "default_title": "Bing -> Google Redirect"
  }
}
````

### 4.2 rules/ruleset.json

Rule logic:

* URL must be main_frame navigation
* Domain restricted to bing.com hosts
* Capture q value and redirect to Google

```json
[
  {
    "id": 1,
    "priority": 1,
    "action": {
      "type": "redirect",
      "redirect": {
        "regexSubstitution": "https://www.google.com/search?q=\\1"
      }
    },
    "condition": {
      "resourceTypes": ["main_frame"],
      "requestDomains": ["www.bing.com", "bing.com"],
      "regexFilter": "^https?:\\/\\/(?:www\\.)?bing\\.com\\/search\\?(?:[^#]*&)?q=([^&]+).*$"
    }
  }
]
```

Notes:

* `\\1` is the captured group for q value.
* We intentionally discard all other parameters by redirecting to a fresh URL.
* If you later want to keep additional params, you can extend the regex or use transform/queryTransform when appropriate.

### 4.3 background.js

Minimal service worker for diagnostics (optional but useful for installation/version checks).

```js
/* global chrome */

chrome.runtime.onInstalled.addListener(async () => {
  // Basic sanity log
  console.log("Bing to Google Redirect installed.");

  // Optional: try regex support check where available.
  // Some browsers expose this API; others may not.
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
```

## 5. Local development (Microsoft Edge)

1. Open Edge:

   * edge://extensions
2. Enable:

   * Developer mode
3. Click:

   * Load unpacked
4. Select the folder:

   * bing-to-google-redirect/

## 6. Test cases

### 6.1 Should redirect

* [https://www.bing.com/search?q=test](https://www.bing.com/search?q=test)
* [https://www.bing.com/search?form=QBRE&q=change%20bing%20to%20google&sp=-1](https://www.bing.com/search?form=QBRE&q=change%20bing%20to%20google&sp=-1)
* [https://bing.com/search?q=hello%20world](https://bing.com/search?q=hello%20world)

Expected:

* [https://www.google.com/search?q=test](https://www.google.com/search?q=test)
* [https://www.google.com/search?q=change%20bing%20to%20google](https://www.google.com/search?q=change%20bing%20to%20google)
* [https://www.google.com/search?q=hello%20world](https://www.google.com/search?q=hello%20world)

### 6.2 Should NOT redirect

* [https://www.bing.com/images/search?q=test](https://www.bing.com/images/search?q=test)
* [https://www.bing.com/search](https://www.bing.com/search) (no q)
* [https://www.google.com/search?q=test](https://www.google.com/search?q=test)

## 7. Troubleshooting

* If redirect does not happen:

  1. Confirm extension is enabled.
  2. Confirm you are navigating the URL in the main tab (main_frame).
  3. Check extension console logs:

     * edge://extensions -> your extension -> "service worker" -> Inspect
  4. Verify the regex matches your exact URL.
  5. Try simplifying regexFilter temporarily to isolate.

## 8. Future enhancements

* Options page to toggle redirect on/off.
* Support additional Bing entrypoints (e.g., region hosts) if needed.
* Preserve additional parameters intentionally (e.g., `lang`, `hl`) via transform/queryTransform.
