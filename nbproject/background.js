chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status !== 'complete')
    {
        return;
    }
    var match = 'https://www.google.com/calendar/render';
    var match2 = 'https://www.google.com/calendar/b/1/render';
    if (tab.url.substring(0, match.length) === match || tab.url.substring(0, match.length) === match2)
    {
        chrome.tabs.executeScript(null, { file: "lib/jquery/jquery.js" }, function() {
            //Execute all the js-scripts
            chrome.tabs.executeScript(null, { file: "js/calendarManager.js" });
            chrome.tabs.executeScript(null, { file: "js/guiCalendar.js" });
            chrome.tabs.executeScript(null, { file: "js/helpFunctions.js" });
            
            //Execute libraries
            chrome.tabs.executeScript(null, { file: "lib/jquery-ui/jquery-ui.min.js" });


            chrome.identity.getAuthToken({ 'interactive': true }, function(token) {

                chrome.tabs.executeScript(tab.id, {
                    code: 'var googleToken = ' + JSON.stringify(token)
                }, function() {
                    chrome.tabs.executeScript(null, {file: 'main.js'});
                });

                //chrome.tabs.executeScript(null, { file: "main.js" });
            });
        });
    }
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.update({ url: "https://www.google.com/calendar/" });
});
