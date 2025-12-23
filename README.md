# Bing to Google Redirect (Edge Extension)
# Bing 轉 Google 導向（Edge 擴充功能）

## Overview
## 簡介

Redirect Bing search URLs to Google, preserving only the `q` query parameter.
將 Bing 搜尋網址導向到 Google，並且只保留 `q` 參數。

Example: `https://www.bing.com/search?q=test` -> `https://www.google.com/search?q=test`
範例：`https://www.bing.com/search?q=test` -> `https://www.google.com/search?q=test`

## Features
## 功能

Redirects only when the URL is `bing.com/search` and contains `q=...`.
只在網址為 `bing.com/search` 且包含 `q=...` 時才導向。

Preserves only `q` and discards all other parameters.
只保留 `q`，其他參數全部忽略。

Built with Manifest V3 + declarativeNetRequest (rule-based redirect).
使用 Manifest V3 + declarativeNetRequest（規則式導向）。

## Install (from GitHub Releases)
## 安裝（從 GitHub Releases）

Download the release ZIP from the GitHub Releases page.
從 GitHub Releases 頁面下載 release ZIP。

Extract the ZIP to a permanent folder (avoid temporary directories).
把 ZIP 解壓縮到固定資料夾（避免暫存目錄）。

Open Edge and go to `edge://extensions/`.
開啟 Edge 並前往 `edge://extensions/`。

Enable Developer mode.
開啟「開發人員模式」。

Click "Load unpacked".
點選「載入未封裝」。

Select the extracted folder that contains `manifest.json` at its root.
選擇解壓縮後、最外層直接包含 `manifest.json` 的資料夾。

## Usage
## 使用方式

Open a Bing search URL in the address bar.
在網址列開啟 Bing 搜尋網址。

Example: `https://www.bing.com/search?q=hello%20world`
範例：`https://www.bing.com/search?q=hello%20world`

It should redirect to Google automatically.
應該會自動導向到 Google。

Expected: `https://www.google.com/search?q=hello%20world`
預期：`https://www.google.com/search?q=hello%20world`

## Expected Non-Redirect Cases
## 正常不導向的情況

No `q` parameter: `https://www.bing.com/search`
沒有 `q` 參數：`https://www.bing.com/search`

Not `/search`: `https://www.bing.com/images/search?q=test`
不是 `/search`：`https://www.bing.com/images/search?q=test`

Already Google: `https://www.google.com/search?q=test`
本來就是 Google：`https://www.google.com/search?q=test`

## Update (Manual)
## 更新方式（手動）

Unpacked installations do not auto-update.
未封裝安裝不會自動更新。

Download the new ZIP and extract over the same folder (or use a new folder).
下載新版 ZIP 並覆蓋解壓到同一個資料夾（或改用新資料夾）。

Go to `edge://extensions/` and click "Reload" for the extension.
到 `edge://extensions/` 對擴充功能按「重新載入」。

If you changed the folder location, remove the extension and Load unpacked again.
如果你換了資料夾位置，請移除擴充功能後再重新載入未封裝。

## Troubleshooting
## 疑難排解

If it does not redirect, confirm the URL is `bing.com/search` and includes `q=`.
如果沒有導向，確認網址是 `bing.com/search` 且包含 `q=`。

Check that the extension is enabled in `edge://extensions/`.
確認擴充功能在 `edge://extensions/` 是啟用狀態。

To view logs, open the extension details and click Service worker -> Inspect.
要看 log，進入擴充功能詳細資訊並點 Service worker -> Inspect。

## Privacy
## 隱私

No data collection, no telemetry, no external requests.
不收集資料、不做追蹤、不對外發送任何請求。

Permissions are used only for URL matching and redirect rules.
權限僅用於匹配網址與執行導向規則。

## License
## 授權

MIT License.
MIT 授權。
