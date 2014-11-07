(function () {
    var id = "pagknpjhappmknlejlnemfdjndgodcbn";
    init();
})();



/**
 * Provides all the calendar related utils.
 */
function CalendarManager() //constructor maakt het object cal en returnt het
{
    var cal = {};
    cal.pollUnderProgress = false;
    cal.eventList = new Array();

    var NUMBER_OF_RESULTS = 10;
    //URL for getting feed of individual calendar support.
    var CALENDAR_URL = 'https://www.google.com/calendar/feeds' +
            '/default/private/embed?toolbar=true&max-results=' + NUMBER_OF_RESULTS;

    /**
     * Extracts event from the each entry of the calendar.
     * @param {Object} elem The XML node to extract the event from.
     * @param {Object} mailId email of the owner of calendar in multiple calendar
     *     support.
     * @return {Object} out An object containing the event properties.
     */
    cal.extractEvent = function (elem, mailId) {
        var out = {};

        for (var node = elem.firstChild; node != null; node = node.nextSibling) {
            if (node.nodeName == 'title') {
                out.title = node.firstChild ? node.firstChild.nodeValue : MSG_NO_TITLE;
            } else if (node.nodeName == 'link' &&
                    node.getAttribute('rel') == 'alternate') {
                out.url = node.getAttribute('href');
            } else if (node.nodeName == 'gd:where') {
                out.location = node.getAttribute('valueString');
            } else if (node.nodeName == 'gd:who') {
                if (node.firstChild) {

                    out.attendeeStatus = node.firstChild.getAttribute('value');
                }
            } else if (node.nodeName == 'gd:eventStatus') {
                out.status = node.getAttribute('value');
            } else if (node.nodeName == 'gd:when') {
                var startTimeStr = node.getAttribute('startTime');
                var endTimeStr = node.getAttribute('endTime');

                startTime = rfc3339StringToDate(startTimeStr);
                endTime = rfc3339StringToDate(endTimeStr);

                if (startTime == null || endTime == null) {
                    continue;
                }

                out.isAllDay = (startTimeStr.length <= 11);
                out.startTime = startTime;
                out.endTime = endTime;
            }
        }
        return out;
    };

    /**
     * Polls the server to get the feed of the user.
     */
    cal.pollServer = function () {
        if (!cal.pollUnderProgress) {
            cal.eventList = [];
            cal.pollUnderProgress = true;

            var url;
            var xhr = new XMLHttpRequest();
            try {
                xhr.onreadystatechange = cal.genResponseChangeFunc(xhr);
                xhr.onerror = function (error) {
                    console.log('error: ' + error);
                };

                url = CALENDAR_URL;

                xhr.open('GET', url);
                xhr.send(null);
            }
            catch (e) {
                console.log('ex: ' + e);

            }
        }


    };

    /**
     * @param {xmlHttpRequest} xhr xmlHttpRequest object containing server response.
     */
    cal.genResponseChangeFunc = function (xhr) {
        return function () {
            if (xhr.readyState != 4) {
                return;
            }
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
    cal.parseCalendarEntry = function (responseXML, calendarId) {
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






var calendarManager = CalendarManager();

function init() {
    if (!$('#btnStatistics').length)
    {
        initButton();
    }
}



function initButton() {
    $("#sidebar").append('</br><input type="button" id="btnStatistics" value="STATISTICS" />');
    $("#btnStatistics").on("click", openStatistics)

    $("#btnStatistics").hover(function () {
        $("#btnStatistics").css({"background-color": "#D13E2C"});
    }, function () {
        $("#btnStatistics").css({"background-color": "#dd4b39"});
    });

    $("#btnStatistics").css({
        "border": "none",
        "border-radius": "7.5%",
        "background-color": "#dd4b39",
        "color": "WHITE",
        "height": "27px",
        "min-width": "54px",
        "font-size": "11px",
        "padding": "5px 5px 5px 5px;",
        "border" :"1px solid transparent",
                "text-align": "center",
        "line-height": "27px",
        "-webkit-user-select": "none",
        "font-weight": "bold",
        "cursor": "pointer"
    });

}


// statistics button click handler
function openStatistics() {
    calendarManager.pollServer();
}

//once the events are retrieved from the server, we do whatever we want with them
function processEvents() {
    for (var i = 0; i < calendarManager.eventList.length; ++i) {
        console.log("Event " + (i + 1));
        console.log(calendarManager.eventList[i].title);
        console.log(calendarManager.eventList[i].startTime);
        console.log(calendarManager.eventList[i].endTime);
        console.log("-----------------");
    }
}


