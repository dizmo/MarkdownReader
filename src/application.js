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
                        if (value) json[key] = jQuery.extend(
                            true, json[key], value
                        );

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

            // TODO: width = bundle.getAttribute('width')
            var width = MarkdownReader.Dizmo.load('width');
            if (typeof width === 'number') {
                dizmo.setWidth(width);
            }

            // TODO: height = bundle.getAttribute('height')
            var height = MarkdownReader.Dizmo.load('height');
            if (typeof height === 'number') {
                dizmo.setHeight(height);
            }

            window.MAIN = new MarkdownReader.Main();
        }
    });

    window.EVAL = eval;
});
