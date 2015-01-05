var calendarApp = calendarApp || {};
calendarApp.gui = calendarApp.gui || {};

calendarApp.gui.init = function() {
    calendarManager.pollServer();
    
    //INIT OVERALL DIV FOR THE STATISTICS  
    if ($("#divStatistics").length === 0)
    {
        $("#gridcontainer").after(calendarApp.gui.createStatisticsContainer());
    }

    $("#divStatistics").hide();

    //INIT THE EXTRA RED BUTTON ON THE SIDEBAR
    if (!$('#btnStatistics').length)
    {
        calendarApp.gui.createSideBarButton('btnStatistics', 'Show statistics', function() {
            if ($("#gridcontainer").is(":visible")) {

                calendarManager.pollServer();

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
    calendarApp.gui.bindEvents();
};

calendarApp.gui.bindEvents = function() {
    //Initialize datapicker
    $("#txtDate").datepicker({
    minDate: 1,
    onSelect: function(theDate) {
        $("#dataEnd").datepicker('option', 'minDate', new Date(theDate));
    },
    beforeShow: function() {
        $('#ui-datepicker-div').css('z-index', 9999);
        $('#ui-datepicker-div').css('background','#ededed');
        $('#ui-datepicker-div').css('border','1px solid black');
        
        console.log(this);
        

    }
    });
    

    $("#selEvents").on('change', function() {
        calendarApp.gui.updateStatistics();
    });

    $("#btnCalculateStatistics").on('click', function() {
        calendarApp.gui.updateStatistics();
    });
};

calendarApp.gui.onSuccessLoadCalendarEvents = function() {
    console.log("onSuccessLoadCalendarEvents");

    var uniqueNames = calendarApp.events.getUniqueEventNames(calendarManager.eventList);
    var selOptionsHtml = calendarApp.gui.getSelectOptions(uniqueNames);

    $("#selEvents").html(selOptionsHtml);

    $("#gridContainer").hide();
};

calendarApp.gui.getSelectOptions = function(arrayNames) {
    var html = "";

    for (var i = 0; i < arrayNames.length; i++) {
        html += "<option value='" + arrayNames[i] + "'>" + arrayNames[i] + "</option>";
    }

    return html;
};

calendarApp.gui.buildStatisticsHtml = function(statistics) {
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
};

calendarApp.gui.showStatistics = function(title, message) {
    $("#divEventStats").html(
            "<p><strong>" + title + "</strong>:<br/>" +
            message
            + "</p>");
};

calendarApp.gui.updateStatistics = function() {
    //if ($("#txtDate").val() !== "" && $("#txtHours").val() !== "") {
        var events = calendarApp.events.getEventsWithTitle(calendarManager.eventList, $("#selEvents").val());

        var dateToFinish = new Date($("#txtDate").val());
        var totalHours = $("#txtHours").val();

        console.log(events);

        
        var obj = calendarApp.statistics.calculateStatistics(events, dateToFinish, totalHours);
        
        console.log("STATISTICS");
        console.log(obj);
        $("#divEventStats").empty();
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                 $("#divEventStats").append("<p>" + key + ": " + obj[key] +"</p>");
            }
        }
};

//CODE UNDERNEATH = INITIATION OF THE GUI ELEMENTS
calendarApp.gui.createSideBarButton = function(id, value, clickHandler) {
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
};

calendarApp.gui.createStatisticsContainer = function() {
    var html = "<div id='divStatistics'>" +
            "<div id='divInputFields'>" +
            "<div> <label>Select Subject</label> <br/> <select id='selEvents'></select> </div>" +
            "<div> <label>Select Deadline Date:</label> <br/><input type='text' id='txtDate'/> </div>" +
            "<div> <label>Select max. hours you want to spend on subject:</label> <br/><input type='number' min='0' id='txtHours'/> </div>" +
            "<div><button id='btnCalculateStatistics'>Generate Statistics</button></div>" +
            "</div>" +
            "<div id='divEventStats'></div>" +
            "</div>";

    return html;
};