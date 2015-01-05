var calendarApp = calendarApp || {};

calendarApp.calendarManager = function(token, onLoadCalendarEventsCallBack) {
    var self = this;
    
    var callBack = onLoadCalendarEventsCallBack;
    
    var pollUnderProgress = false;
    var myKey = token;
    var CALENDAR_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=' + myKey;

    self.eventList = new Array();

    /**
     * Get the events from the calendarAPI
     */
    self.pollServer = function() {
        if (!pollUnderProgress) {
            self.eventList = [];
            pollUnderProgress = true;

            $.ajax({
                dataType: "json",
                url: CALENDAR_URL,
                success: self.genResponseChangeFunc
            });
        }
    };

    /**
     * @param {xmlHttpRequest} xhr xmlHttpRequest object containing server response.
     */
    self.genResponseChangeFunc = function(data) {
        self.parseCalendarEntries(data);

        pollUnderProgress = false;

        //When all the events are polled from the server, execute the callback from the constructor
        onLoadCalendarEventsCallBack();
        
        return;
    };


    self.parseCalendarEntries = function(data)
    {
        var events = data.items;
        for (var i = 0; i < events.length; ++i)
        {
            var entry = events[i];
            var event = {};
            event.title = entry.summary.toUpperCase();
            var startTime = calendarApp.date.parseGoogleDate(entry.start.dateTime);
            var endTime =   calendarApp.date.parseGoogleDate(entry.end.dateTime);

            if (startTime && endTime) {
                event.isAllDay = (entry.start.dateTime.length <= 11);
                event.startTime = startTime;
                event.endTime = endTime;
            }
            self.eventList.push(event);
        }

    };
};