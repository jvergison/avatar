/**
 * Provides all the calendar related utils.
 */
function CalendarManager(token) //constructor maakt het object cal en returnt het
{
    var cal = {};
    cal.pollUnderProgress = false;
    cal.eventList = new Array();

    var mykey = token;
    var CALENDAR_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=' + mykey;

    /**
     * Polls the server to get the feed of the user.
     */
    cal.pollServer = function() {
        if (!cal.pollUnderProgress) {
            cal.eventList = [];
            cal.pollUnderProgress = true;
            
            $.ajax({
                dataType: "json",
                url: CALENDAR_URL,                
                success: cal.genResponseChangeFunc
            });
        }
    };

    /**
     * @param {xmlHttpRequest} xhr xmlHttpRequest object containing server response.
     */
    cal.genResponseChangeFunc = function(data) {
        console.log(data);
        cal.parseCalendarEntries(data);

        cal.pollUnderProgress = false;

        //When all the events are polled from the server, execute the callback in main.js
        onEventLoadComplete();
        return;
    };
    
    
    cal.parseCalendarEntries = function(data)
    {
        var events = data.items;
        for(var i = 0; i < events.length; ++i)
        {
            var entry = events[i];
            var event = {};
            event.title = entry.summary.toUpperCase();
            
            //console.log(event.start);
            var startTime = parseGoogleDate(entry.start.dateTime);
            var endTime = parseGoogleDate(entry.end.dateTime);

            if (startTime && endTime){
                event.isAllDay = (entry.start.dateTime.length <= 11);
                event.startTime = startTime;
                event.endTime = endTime;
            }
            cal.eventList.push(event);
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

                if (cal.eventList[i].title === title.toUpperCase()) {
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
};

//DATES
function parseGoogleDate(d) {   
   return new Date(Date.parse(d));
}

//END calendar manager	