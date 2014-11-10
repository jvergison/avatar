chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status !== 'complete')
    {
        return;
    }
    var match = 'https://www.google.com/calendar/render';
    var match2 = 'https://www.google.com/calendar/b/1/render';
    if (tab.url.substring(0, match.length) === match || tab.url.substring(0, match.length) === match2)
    {
        chrome.tabs.executeScript(null, { file: "scripts/jquery-1.11.1.min.js" }, function() {
            chrome.tabs.executeScript(null, { file: "helpfunctions.js" });
            chrome.tabs.executeScript(null, { file: "calendarmanager.js" });
            chrome.tabs.executeScript(null, { file: "main.js" });
        });
    }
});

