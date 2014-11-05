(function () {
    var id = "pagknpjhappmknlejlnemfdjndgodcbn";
    init();
})();

function init() {
	if(!$('#btnStatistics').length)
	{
		initButton();
	}
}



function initButton() {
    $("#sidebar").append('</br><input type="button" id="btnStatistics" value="STATISTICS" />');
    $("#btnStatistics").on("click", openStatistics)

    $("#btnStatistics").hover(function(){
        $("#btnStatistics").css({"background-color": "#D13E2C"});
    }, function(){
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

function openStatistics(){
}
