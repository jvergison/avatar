/**
 * Provides all the calendar related utils.
 */
function CalendarManager() //constructor maakt het object cal en returnt het
{
    var cal = {};
    cal.pollUnderProgress = false;
    cal.eventList = new Array();

    //URL for getting feed of individual calendar support.
    //var CALENDAR_URL = 'https://www.google.com/calendar/feeds' +
    //        '/default/private/embed?toolbar=true&max-results=' + NUMBER_OF_RESULTS;
    var CALENDAR_URL = 'https://www.google.com/calendar/feeds/default/private/embed?futureevents=false'

    /**
     * Extracts event from the each entry of the calendar.
     * @param {Object} elem The XML node to extract the event from.
     * @param {Object} mailId email of the owner of calendar in multiple calendar
     *     support.
     * @return {Object} out An object containing the event properties.
     */
    cal.extractEvent = function(elem, mailId) {
        var out = {};

        for (var node = elem.firstChild; node != null; node = node.nextSibling) {
            switch(node.nodeName){
                case 'title':
                    out.title = node.firstChild ? node.firstChild.nodeValue : MSG_NO_TITLE;
                    break;
                    
                case 'link': 
                    if(node.getAttribute('rel') == 'alternate')
                        out.url = node.getAttribute('href');
                    break;
                    
                case'gd:where':
                    out.location = node.getAttribute('valueString');
                    break;
                    
                case 'gd:who':
                    if (node.firstChild)
                    out.attendeeStatus = node.firstChild.getAttribute('value');  
                    break;
                    
                case 'gd:eventStatus':
                    out.status = node.getAttribute('value');
                    break;
                    
                case 'gd:when':
                    var startTimeStr = node.getAttribute('startTime');
                    var endTimeStr = node.getAttribute('endTime');

                    startTime = rfc3339StringToDate(startTimeStr);
                    endTime = rfc3339StringToDate(endTimeStr);

                    if (startTime && endTime){
                        out.isAllDay = (startTimeStr.length <= 11);
                        out.startTime = startTime;
                        out.endTime = endTime;
                    }
                break;
            }
        }
        return out;
    };

    /**
     * Polls the server to get the feed of the user.
     */
    cal.pollServer = function() {
        if (!cal.pollUnderProgress) {
            cal.eventList = [];
            cal.pollUnderProgress = true;

            var url;
            var xhr = new XMLHttpRequest();
            try {
                xhr.onreadystatechange = cal.genResponseChangeFunc(xhr);
                xhr.onerror = function(error) { console.log('error: ' + error); };

                url = CALENDAR_URL;

                xhr.open('GET', url);
                xhr.send(null);
            }
            catch(err) {
                console.log('ex: ' + err);
            }
        }
    };

    /**
     * @param {xmlHttpRequest} xhr xmlHttpRequest object containing server response.
     */
    cal.genResponseChangeFunc = function(xhr) {
        return function() {
            if (xhr.readyState != 4) return;
            if (!xhr.responseXML) {
                console.log('No responseXML');
                return;
            }

            cal.parseCalendarEntry(xhr.responseXML, 0);
            cal.pollUnderProgress = false;

            processEvents();
            return;
        };
    };

    /**
     * Parses events from calendar response XML
     * @param {string} responseXML Response XML for calendar.
     * @param {integer} calendarId  Id of the calendar in array of calendars.
     */
    cal.parseCalendarEntry = function(responseXML, calendarId) {
        var entry_ = responseXML.getElementsByTagName('entry');
        var mailId = null;
        var author = null;

        if (responseXML.querySelector('author name')) {
            author = responseXML.querySelector('author name').textContent;
        }
        if (responseXML.querySelector('author email')) {
            mailId = responseXML.querySelector('author email').textContent;
        }

        if (entry_ && entry_.length > 0) {
            for (var i = 0, entry; entry = entry_[i]; ++i) {

                //haal de info van het event uit de xml en stop het in een object
                var event_ = cal.extractEvent(entry, mailId);
                this.eventList.push(event_);

            }
        }
    };

    /**
     * Returns an array of events with the same title
     * @param {type} title
     * @returns {Array|@exp;cal@pro;eventList}
     */
    cal.getEventsWithTitle = function(title) {

        if (typeof title === 'undefined') {
            return cal.eventList;
        } else {
            var events = new Array();

            for (var i = 0; i < cal.eventList.length; i++) {

                if (cal.eventList[i].title === title) {
                    events.push(cal.eventList[i]);
                }
            }

            return events;
        }
    };

    /**
     * Returns an object that contains an array for past, ongoing and future events
     * @param {array} The array of events
     * @returns {object}
     */
    cal.getEventsByType = function(eventList) {
        var pastEvents = new Array();
        var futureEvents = new Array();
        var ongoingEvents = new Array();
        var currentDate = new Date();

        //var eventList = typeof title === 'undefined' ? cal.eventList : cal.getEventsWithTitle(title);

        for (var i = 0; i < eventList.length; i++) {
            if (eventList[i].endTime <= currentDate) {
                //Event happened in the past
                pastEvents.push(eventList[i]);
            }
            else if (eventList[i].startTime > currentDate && eventList[i].endTime > currentDate) {
                //Event will happen in the future
                futureEvents.push(eventList[i]);
            }
            else if (eventList[i].startTime <= currentDate && eventList[i].endTime >= currentDate) {
                //Event is ongoing
                ongoingEvents.push(eventList[i]);
            }
        }

        return {
            "past": pastEvents,
            "ongoing": ongoingEvents,
            "future": futureEvents
        };
    };
    
    /**
     * Get the total amount of hours for an array of events
     * @param {type} title
     * @returns {Number}
     */
    cal.getTotalHoursOfEvents = function(events) {
        var hours = 0;

        for (var i = 0; i < events.length; i++) {
            //log
            hours += calculateEventDuration(events[i].startTime, events[i].endTime);
        }

        return hours;
    };
    
    /**
     * A function that calculates the ratio between completed events and events that have yet to be completed
     * @param {type} The title of the events
     * @returns {undefined}
     */
    cal.calculateCompleteRatio = function(title) {
        var events = cal.getEventsWithTitle(title);
        var typeObj = cal.getEventsByType(events);
        
        var totalHours = cal.getTotalHoursOfEvents(events);
        var completedHours = cal.getTotalHoursOfEvents(typeObj.past);
        
        return parseFloat(completedHours / totalHours);
    };

    return cal;
}
;


var DATE_TIME_REGEX =
        /^(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)\.\d+(\+|-)(\d\d):(\d\d)$/;
var DATE_TIME_REGEX_Z = /^(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)\.\d+Z$/;
var DATE_REGEX = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;

/**
 * Convert the incoming date into a javascript date.
 * @param {String} rfc3339 The rfc date in string format as following
 *     2006-04-28T09:00:00.000-07:00
 *     2006-04-28T09:00:00.000Z
 *     2006-04-19.
 * @return {Date} The javascript date format of the incoming date.
 */
function rfc3339StringToDate(rfc3339) {
    var parts = DATE_TIME_REGEX.exec(rfc3339);

    // Try out the Z version
    if (!parts) {
        parts = DATE_TIME_REGEX_Z.exec(rfc3339);
    }

    if (parts && parts.length > 0) {
        var d = new Date();
        d.setUTCFullYear(parts[1], parseInt(parts[2], 10) - 1, parts[3]);
        d.setUTCHours(parts[4]);
        d.setUTCMinutes(parts[5]);
        d.setUTCSeconds(parts[6]);

        var tzOffsetFeedMin = 0;
        if (parts.length > 7) {
            tzOffsetFeedMin = parseInt(parts[8], 10) * 60 + parseInt(parts[9], 10);
            if (parts[7] != '-') { // This is supposed to be backwards.
                tzOffsetFeedMin = -tzOffsetFeedMin;
            }
        }
        return new Date(d.getTime() + tzOffsetFeedMin * 60 * 1000);
    }

    parts = DATE_REGEX.exec(rfc3339);
    if (parts && parts.length > 0) {
        return new Date(parts[1], parseInt(parts[2], 10) - 1, parts[3]);
    }
    return null;
}
;
//END calendar manager	