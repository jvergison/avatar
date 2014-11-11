/**
 * Function that calculates event duration
 * @param {type} date1
 * @param {type} date2
 * @returns {unresolved}
 */
function calculateEventDuration(date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date2_ms - date1_ms);
    
    //take out milliseconds
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);
    
    //console.log(convertToHours(days, hours, minutes, seconds));
    //console.log(days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds');
    
    return convertToHours(days, hours, minutes, seconds);
}

function convertToHours(days, hours, minutes, seconds) {
    return parseFloat((24 * days) + (hours) + (minutes / 60) + (seconds / 3600));
};