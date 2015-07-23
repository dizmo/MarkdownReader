//= require Main

function showBack() {
    dizmo.showBack();
}

function showFront() {
    dizmo.showFront();
}

var events = {};
window.document.addEventListener('dizmoready', function () {
    jQuery.getJSON('assets/settings.json', function (json) {
        if (window.MAIN === undefined) {
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

            window.MAIN = new MarkdownReader.Main();
        }
    });
});
