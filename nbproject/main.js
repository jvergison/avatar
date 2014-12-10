(function() {
    var id = "pagknpjhappmknlejlnemfdjndgodcbn";
    //Initialize the global object calendarManager
    calendarManager = new calendarApp.calendarManager(googleToken,
            calendarApp.gui.onSuccessLoadCalendarEvents);

    calendarApp.gui.init();

})();