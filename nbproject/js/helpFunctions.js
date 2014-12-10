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
    
    var completeRatio   = calendarApp.statistics.calculateCompleteRatio(events);
    var averageHoursTillDeadline = calendarApp.statistics.calculateAverageAmountOfHoursToDo(completedHours, totalHours, deadlinedate);
    var finishedInTime = calendarApp.statistics.calculateIfFinishedInTime(completedHours,
            calendarApp.date.getFirstEventDate(events),
            deadlinedate
            );

    /*
     for (var i = 0; i < events.length; ++i) {
     var event = events[i];
     
     var duration = calculateEventDuration(event.startTime, event.endTime);
     
     var statistic = eventStatistics[event.title] || {
     totalhours: 0,
     completedhours: 0
     };
     
     //total hours statistic
     
     statistic.totalhours += duration;
     
     //past hours statistic
     if (event.endTime <= currentDate)
     statistic.completedhours += duration;
     
     eventStatistics[event.title] = statistic;
     }
     */

    //generateDivFromStatistics(eventStatistics);

    return {
        completedHours: completedHours,
        totalHours: totalHours,
        completeRatio: completeRatio,
        averageHoursTillDeadline: averageHoursTillDeadline,
        finishedIntTime: finishedInTime
    }
};

calendarApp.statistics.calculateIfFinishedInTime = function(completedHours, earliestDate, deadlineDate) {
    var studiedInTime = false;

    var currentDate = new Date();

    var tempo = parseFloat(completedHours / calendarApp.date.calculateEventDuration(earliestDate, currentDate));

    var hoursTillDeadLine = calendarApp.date.calculateEventDuration(currentDate, deadlineDate);

    var hoursTillDeadLineTempoRatio = parseFloat(hoursTillDeadLine / tempo);

    currentDate.setHours(currentDate.getHours() + hoursTillDeadLineTempoRatio);

    if (currentDate <= deadlineDate) {
        studiedInTime = true;
    }

    //If negative > not in time
    //Else: in time
    return (deadlineDate - currentDate) / 3600000;
};

calendarApp.statistics.calculateAverageAmountOfHoursToDo = function(hoursCompleted, totalHours, dateDeadline) {
    var currentDate = new Date();

    //Hours between today and deadline
    var hours = calendarApp.date.calculateEventDuration(currentDate, dateDeadline);

    var averageHoursPerHour = Math.abs(totalHours - hoursCompleted) / (hours);

    //Return the average hours per days;
    return averageHoursPerHour;
};

/**
 * A function that calculates the ratio between completed events and events that have yet to be completed
 * @param {type} The title of the events
 * @returns {undefined}
 */
calendarApp.statistics.calculateCompleteRatio = function(events) {

    var totalHours = calendarApp.events.getTotalHoursOfEvents(events);
    var completedHours = calendarApp.events.getCompletedHours(events);

    return parseFloat(completedHours / totalHours);
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