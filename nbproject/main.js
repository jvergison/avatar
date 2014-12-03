(function() {
    var id = "pagknpjhappmknlejlnemfdjndgodcbn";
    //Initialize the global object calendarManager
    calendarManager = CalendarManager(googleToken);
    init();

})();

function init() {
    calendarManager.pollServer();
    if($("#divStatistics").length === 0)
    {
        $("#gridcontainer").after(
            "<div id='divStatistics'></div>"
        );
    }
    $("#divStatistics").hide();

    if (!$('#btnStatistics').length)
    {
        initButton('btnStatistics', 'Show statistics', function(){
            if($("#gridcontainer").is(":visible")){
                openStatistics();
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

        //Button wordt enkel gemaakt omdat polling async werkt.
        //Idee: Telkens als er een functie wordt opgeroepen voor statistieken: server pollen, maar functie moet wachten met uitvoeren tot server gepollt is
        //initButton('btnPollServer', 'POLL SERVER', pollServer);
        initDiv('divInfo');
    }
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

function initDiv(id) {
    $("#sidebar").append('<div id="' + id + '"></div>');
}

function showStatisticsInDiv(divId, title, message) {
    $("#divStatistics").html(
            "<p><strong>" + title + "</strong>:<br/>" +
            message
            + "</p>");
}

function pollServer() {
    calendarManager.pollServer();
}

// statistics button click handler
function openStatistics() {
    calendarManager.pollServer();
    //processEvents();


}

//once the events are retrieved from the server, we do whatever we want with them
function processEvents() {
    console.log("Processing events");


    var eventStatistics = {};
    var currentDate = new Date();

    for (var i = 0; i < calendarManager.eventList.length; ++i) {
        var event = calendarManager.eventList[i];
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

    $("#gridContainer").hide();

}

function generateDivFromStatistics( statistics )
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


    showStatisticsInDiv('divInfo', "Statistics", message);
}