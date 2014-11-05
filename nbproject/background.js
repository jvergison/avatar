chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status !== 'complete')
    {
        return;
    }
    var match = 'https://www.google.com/calendar/render';
    if (tab.url.substring(0, match.length) === match)
    {
        chrome.tabs.executeScript(null, { file: "scripts/jquery-1.11.1.min.js" }, function() {
            chrome.tabs.executeScript(null, { file: "main.js" });
        });
    }
});

