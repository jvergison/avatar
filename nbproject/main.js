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
        initButton();
    }
}



function initButton() {
    $("#sidebar").append('</br><input type="button" id="btnStatistics" value="STATISTICS" />');
    $("#btnStatistics").on("click", openStatistics)

    $("#btnStatistics").hover(function() {
        $("#btnStatistics").css({"background-color": "#D13E2C"});
    }, function() {
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
    //calendarManager.pollServer();
    processEvents();
    
    console.log(calendarManager.getEventsWithTitle("sharepoint"));
    console.log(calendarManager.getEventsByType());
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


