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
            showBack = undefined;
        }

        if (MarkdownReader.Dizmo.load('showFront') !== true) {
            showFront = undefined;
        }

        MAIN = new MarkdownReader.Main();
    });
});
