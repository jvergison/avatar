(function () {
    var id = 'ppdahdklecfhdhfdkhalcddcidlgmeon';
    var myAudio = new Audio('chrome-extension://' + id + '/today.wav');
    myAudio.load();
    var myImg = new Image();
    myImg.src = 'chrome-extension://' + id + '/neildiamond.png';
    myImg.style.position = 'absolute';
    myImg.style.display = 'none';
    document.body.appendChild(myImg);

    setInterval(function () {

        var buttons = document.getElementsByClassName('date-nav-today');
        var i;
        for (i = 0; (i < buttons.length); i++) {
            var button = buttons[i];
            var inner = button.getElementsByClassName('goog-imageless-button-content')[0];
            if (!inner.getAttribute('data-' + id + '-set')) {
                inner.addEventListener('click', function () {
                    myAudio.currentTime = 0;
                    myAudio.play();
                    startAnimation();
                    return true;
                });
                inner.setAttribute('data-' + id + '-set', 1);
            }
        },
        100
        )
        ;
    })();