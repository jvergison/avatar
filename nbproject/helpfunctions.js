/**
 * Function that calculates event duration
 * @param {type} date1
 * @param {type} date2
 * @returns {unresolved}
 */
function calculateEventDuration(date1, date2) {
    return Math.abs(date1 - date2) / 3600000;
}


//FUNCTIONS FOR CALCULATING STATISTIC VALUES

/**
 * Calculates the average amount of hours per day/week you should spend on a certain subject in order to reach the deadline
 * @param {type} calendarevents
 * @returns {undefined}
 */
function calculateAverageAmountOfHoursToDo() {
    
}

/**
 * Calculates how many days before the set deadline you will meet your objective if you keep studying at this rate
 * @returns {undefined}
 */
function statistic3() {
    
}

// Set/update calendar events in google storage
function saveCalendarItems(calendarevents){
    chrome.storage.sync.set({"calendarevents" : calendarevents});
}

// Get stored calendar events from google storage
function loadCalendarItems(){
    return chrome.storage.sync.get("calendarevents");
}