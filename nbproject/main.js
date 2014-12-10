(function() {
    var id = "pagknpjhappmknlejlnemfdjndgodcbn";
    //Initialize the global object calendarManager
    calendarManager = CalendarManager(googleToken);
    init();

})();

function init() {
    calendarManager.pollServer();
    
    //INIT OVERALL DIV FOR THE STATISTICS  
    if ($("#divStatistics").length === 0)
    {
        $("#gridcontainer").after(initStatisticsDiv());
    }

    $("#divStatistics").hide();

    //INIT THE EXTRA RED BUTTON ON THE SIDEBAR
    if (!$('#btnStatistics').length)
    {
        initButton('btnStatistics', 'Show statistics', function() {
            if ($("#gridcontainer").is(":visible")) {
                pollServer();
                $("#btnStatistics").prop('value', 'Back to calendar');
                $("#divStatistics").show();
                $("#gridcontainer").hide();
            }
            else
            {
                $("#btnStatistics").prop('value', 'Show statistics');
                $("#divStatistics").hide();
                $("#gridcontainer").show();
            }
        });
    }

    //Bind GUI events
    bindEventHandlers();
}

function initButton(id, value, clickHandler) {
    $("#sidebar").append('</br><input type="button" id="' + id + '" value="' + value + '" />');

    $("#" + id)
            .on("click", clickHandler)
            .hover(function() {
        $(this).css({"background-color": "#D13E2C"});
    }, function() {
        $(this).css({"background-color": "#dd4b39"});
    })
            .css({
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

function showStatisticsInDiv(title, message) {
    $("#divEventStats").html(
            "<p><strong>" + title + "</strong>:<br/>" +
            message
            + "</p>");
}


function pollServer() {
    calendarManager.pollServer();
}

/**
 * The general callback function to be executed once all events are returned from the server.
 * @returns {undefined}
 */
function onEventLoadComplete() {
    console.log("Processing events");

    $("#selEvents").html(
            getUniqueNameSelectOptions(
                getUniqueEventNames(calendarManager.eventList)
    ));

    $("#gridContainer").hide();

}

function generateDivFromStatistics(statistics)
{
    //loop over statistics and show the div
    var message = "";
    for (var key in statistics) {
        if (statistics.hasOwnProperty(key)) {
            //add to message
            var totalHours = statistics[key].totalhours;

            var completed = statistics[key].completedhours;
            var togo = totalHours - completed;
            message += "<i>" + key + "</i><br/>";
            message += "Total Hours: " + totalHours + "<br/> Completed: "
                    + completed + "<br/> To go: " + togo + "<br/>";
        }
    }


    showStatisticsInDiv("Statistics", message);
}

function initStatisticsDiv() {
    var html = "<div id='divStatistics'>" +
            "<div id='divInputFields'>" +
            "<select id='selEvents'></select> <br/>" +
            "<input type='text' id='txtDate'/> <br/>" +
            "<input type='number' id='txtHours'/> <br/>" +
            "<button id='btnCalculateStatistics'>Generate Statistics</button>" +
            "</div>" +
            "<div id='divEventStats'></div>" +
            "</div>";

    return html;
}

function calculateStatistics(events, dateToFinish, totalHours) {
    var eventStatistics = {};
    var currentDate = new Date();

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

    generateDivFromStatistics(eventStatistics);
}

/**
 * Returns an array containing unique titles for all the events.
 * 
 * @param {type} eventList
 * @returns {Array}
 */
function getUniqueEventNames(eventList) {
    console.log("getUniqueEventNames");

    var uniqueNames = [];

    $.each(eventList, function(i, el) {
        console.log(el);

        if ($.inArray(el.title, uniqueNames) === -1) {
            uniqueNames.push(el.title);
        }
    });

    return uniqueNames;
}

/**
 * Binds all the events to the controls in the statisticsDiv
 * 
 * @returns {undefined}
 */
function bindEventHandlers() {
    //Initialize datapicker
    $("#txtDate").datepicker();

    $("#selEvents").on('change', function() {
        updateStatistics();
    });

    $("#btnCalculateStatistics").on('click', function() {
        updateStatistics();
    });
}

/**
 * 
 * @returns {undefined}
 */
function updateStatistics() {
    var events = calendarManager.getEventsWithTitle($("#selEvents").val());
    
    var dateToFinish = $("#txtDate").val();
    var totalHours = $("#txtHours").val();
    
    console.log(events);


    calculateStatistics(events, dateToFinish, totalHours);
}

function getUniqueNameSelectOptions(arrayNames) {
    var html = "";

    for (var i = 0; i < arrayNames.length; i++) {
        html += "<option value='" + arrayNames[i] + "'>" + arrayNames[i] + "</option>";
    }

    return html;
}

//FUNCTIONS FOR CALCULATING STATISTIC VALUES
