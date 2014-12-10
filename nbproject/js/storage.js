var calendarApp = calendarApp || {};
calendarApp.storage = calendarApp.storage || {};

calendarApp.storage.saveCalendarItems = function(calendarevents){
    chrome.storage.sync.set({"calendarevents" : calendarevents});
};

// Get stored calendar events from google storage
calendarApp.storage.loadCalendarItems = function(){
    return chrome.storage.sync.get("calendarevents");
};