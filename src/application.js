//= require Main

function showBack() {
    dizmo.showBack();
}

function showFront() {
    dizmo.showFront();
}

var events = {};
jQuery(document).ready(function () {
    jQuery.getJSON('assets/settings.json', function (json) {
        if (jQuery.isPlainObject(json)) {
            for (var key in json) {
                if (json.hasOwnProperty(key)) {
                    MarkdownReader.Dizmo.save(key, json[key]);
                }
            }
        }

        if (MarkdownReader.Dizmo.load('showBack') !== true) {
            window.showBack = undefined;
        }

        if (MarkdownReader.Dizmo.load('showFront') !== true) {
            window.showFront = undefined;
        }

        window.MAIN = new MarkdownReader.Main();

        ///////////////////////////////////////////////////////////////////////

        window.FRAMECOLOR = function () {
            jQuery(events).trigger(
                'dizmo.framecolor', dizmo.getAttribute('settings/framecolor'));
        };

        setTimeout(window.FRAMECOLOR, 125);
        setTimeout(window.FRAMECOLOR, 375);
        setTimeout(window.FRAMECOLOR, 875);
    });
});
