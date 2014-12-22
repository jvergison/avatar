var calendarApp = calendarApp || {};

//NAMESPACE DATE
//This namespace is reserved for generic date functions
calendarApp.date = calendarApp.date || {};

calendarApp.date.calculateEventDuration = function(date1, date2) {
    return Math.abs(date1 - date2) / 3600000;
};

calendarApp.date.parseGoogleDate = function(date) {
    return new Date(Date.parse(date));
};

calendarApp.date.getFirstEventDate = function(events) {
    var date = new Date();

    for (var i = 0; i < events.length; i++) {
        if (events[i].startTime < date) {
            date = events[i].startTime;
        }
    }

    return date;
};

////////////

//NAMESPACE STATISTICS
//This namespace is reserved for statistical calculation functions.
calendarApp.statistics = calendarApp.statistics || {};

calendarApp.statistics.calculateStatistics = function(events, deadlinedate, deadlinehours) {
    var totalHours  = calendarApp.events.getTotalHoursOfEvents(events);
    var completedHours = calendarApp.events.getCompletedHours(events);
    var eventStart = calendarApp.date.getFirstEventDate(events);
    
    var hoursLeftTillDeadline = "A deadline is required for this statistic";
    var hoursToDoEachDay = "A deadline and total amount of hours are required for this statistic";
    var percentageComplete = "A total amount of hours is required for this statistic";
    if(deadlinedate != "Invalid Date")
    {
        hoursLeftTillDeadline = calendarApp.statistics.calculateHoursLeftAfterCompletion(completedHours, eventStart, deadlinedate);
    }
    
    if(deadlinehours != "")
    {
        percentageComplete = calendarApp.statistics.calculatePercentageComplete(completedHours, deadlinehours);
    }
    
    if(deadlinedate != "Invalid Date" && deadlinehours != "")
    {
        hoursToDoEachDay = calendarApp.statistics.calculateHoursToDoEachDay(completedHours, deadlinehours, deadlinedate);
    }

        

    return {
        "Completed Hours": completedHours,
        "Total Hours": totalHours,
        "Hours to do Each Day": hoursToDoEachDay,
        "Percentage completed": percentageComplete,
        "Hours spare after completion": hoursLeftTillDeadline,
    };
};

calendarApp.statistics.calculateHoursToDoEachDay = function(hoursCompleted, totalHours, dateDeadline)
{
    var today = new Date();
    var daysTillDeadline = calendarApp.date.calculateEventDuration(today, dateDeadline)/24;
    
    if(daysTillDeadline < 1) //deadline is tomorrow, so work to do today
    {
        daysTillDeadline = 1;
    }
    
    var hours = totalHours - hoursCompleted;
    return +(hours/(daysTillDeadline)).toFixed(2);
};

calendarApp.statistics.calculatePercentageComplete = function(hoursCompleted, totalHours)
{
    return +(hoursCompleted/totalHours*100).toFixed(2);
};

calendarApp.statistics.calculateHoursLeftAfterCompletion = function(hoursCompleted, eventStart, dateDeadline)
{
    
    var today = new Date();
    var firstAndTodayDiff = calendarApp.date.calculateEventDuration(eventStart, today);
    if(hoursCompleted != 0)
    {
        var tempo = hoursCompleted/firstAndTodayDiff;
        var hoursToGo = calendarApp.date.calculateEventDuration(today,dateDeadline);
        return +(hoursToGo*tempo).toFixed(2);
    }
    else
    {
        return "Assessed time left is based on current tempo. \nThis is impossible to calculate if there isn't at least 1 completed hour.";
    }
    
};

///////////////////

//EVENTS NAMESPACE
//This namespace is reserved for functions executed on an event list
calendarApp.events = calendarApp.events || {};

/**
 * Returns an array of events with the same title
 * @param {type} title
 * @returns {Array|@exp;cal@pro;eventList}
 */
calendarApp.events.getEventsWithTitle = function(allEvents, title) {

    if (typeof title === 'undefined') {
        return allEvents;
    } else {
        var events = new Array();

        for (var i = 0; i < allEvents.length; i++) {

            if (allEvents[i].title === title.toUpperCase()) {
                events.push(allEvents[i]);
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
calendarApp.events.getEventsByType = function(events) {
    var pastEvents = new Array();
    var futureEvents = new Array();
    var ongoingEvents = new Array();
    var currentDate = new Date();

    for (var i = 0; i < events.length; i++) {
        if (events[i].endTime <= currentDate) {
            //Event happened in the past
            pastEvents.push(events[i]);
        }
        else if (events[i].startTime > currentDate && events[i].endTime > currentDate) {
            //Event will happen in the future
            futureEvents.push(events[i]);
        }
        else if (events[i].startTime <= currentDate && events[i].endTime >= currentDate) {
            //Event is ongoing
            ongoingEvents.push(events[i]);
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
calendarApp.events.getTotalHoursOfEvents = function(events) {
    var hours = 0;

    for (var i = 0; i < events.length; i++) {
        hours += calendarApp.date.calculateEventDuration(events[i].startTime, events[i].endTime);
    }

    return hours;
};

/**
 * Get the amount of hours you've already completed
 * @param {type} events
 * @returns {Number}
 */
calendarApp.events.getCompletedHours = function(events) {
    var hours = 0;
    var currentDate = new Date();

    for (var i = 0; i < events.length; i++) {
        if (events[i].endTime <= currentDate) {
            hours += calendarApp.date.calculateEventDuration(events[i].startTime, events[i].endTime);
        }
    }

    return hours;
};

/**
 * Returns an array containing unique titles for all the events.
 * 
 * @param {type} eventList
 * @returns {Array}
 */
calendarApp.events.getUniqueEventNames = function(events) {
    console.log("getUniqueEventNames");

    var uniqueNames = new Array();

    $.each(events, function(i, el) {
        if ($.inArray(el.title, uniqueNames) === -1) {
            uniqueNames.push(el.title);
        }
    });

    return uniqueNames;
}