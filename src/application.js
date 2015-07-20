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
                    var value = MarkdownReader.Dizmo.load(key);
                    if (value === undefined || value === null) {
                        MarkdownReader.Dizmo.save(key, json[key]);
                    }
                }
            }
        }

        if (MarkdownReader.Dizmo.load('showBack') !== true) {
            window.showBack = undefined;
        }

        if (MarkdownReader.Dizmo.load('showFront') !== true) {
            window.showFront = undefined;
        }

        if (MarkdownReader.Dizmo.load('tocFlag') === true) {
            var w = MarkdownReader.Dizmo.getWidth(),
                h = MarkdownReader.Dizmo.getHeight();

            MarkdownReader.Dizmo.setSize(w - 254, h);
        }

        window.MAIN = new MarkdownReader.Main();
    });
});
