(function() {
    var id = "pagknpjhappmknlejlnemfdjndgodcbn";

    //Initialize the global object calendarManager
    calendarManager = CalendarManager();

    init();
})();

function init() {
    calendarManager.pollServer();

    if (!$('#btnStatistics').length)
    {
        initButton('btnStatistics', 'STATISTICS', openStatistics);

        //Button wordt enkel gemaakt omdat polling async werkt.
        //Idee: Telkens als er een functie wordt opgeroepen voor statistieken: server pollen, maar functie moet wachten met uitvoeren tot server gepollt is
        initButton('btnPollServer', 'POLL SERVER', pollServer);
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
    $("#" + divId).html(
            "<p><strong>" + title + "</strong>:<br/>" +
            message
            + "</p>");
}

function pollServer() {
    calendarManager.pollServer();
}

// statistics button click handler
function openStatistics() {
    //calendarManager.pollServer();
    //processEvents();
    
    var totalHours = calendarManager.getTotalHoursOfEvents(calendarManager.getEventsWithTitle("sharepoint"));
    var completed = calendarManager.calculateCompleteRatio("sharepoint") * 100;

    var message = "Total Hours: " + totalHours + "<br/>% completed: " + completed + "% <br/>% to complete: " + (100 - completed);

    showStatisticsInDiv('divInfo', "Statistics for SharePoint", message);
}

//once the events are retrieved from the server, we do whatever we want with them
function processEvents() {
    console.log("Processing events");

    for (var i = 0; i < calendarManager.eventList.length; ++i) {
        console.log("Event " + (i + 1));
        console.log(calendarManager.eventList[i].title);
        console.log(calendarManager.eventList[i].startTime);
        console.log(calendarManager.eventList[i].endTime);
        console.log("-----------------");
    }
}


