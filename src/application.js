//= require function/after
//= require function/assert
//= require function/before
//= require function/buffered
//= require function/guid
//= require function/mine
//= require function/partial
//= require function/random
//= require function/with

//= require dizmo
//= require editor
//= require markdown_reader
//= require main

var events = {};
window.document.addEventListener('dizmoready', function () {
    jQuery.get('assets/settings.json').done(function (json) {
        if (window.MAIN === undefined) {
            window.MAIN = true;

            if (jQuery.isPlainObject(json) === false) {
                json = JSON.parse(json);
            }

            for (var key in json) {
                if (json.hasOwnProperty(key)) {
                    var value = MarkdownReader.Dizmo.load(key);
                    if (value !== undefined) {
                        if (value !== null) {
                            if (typeof value === 'object') {
                                json[key] = jQuery.extend(true, json[key], value);
                            } else {
                                json[key] = value;
                            }
                        }
                    }

                    MarkdownReader.Dizmo.save(key, json[key]);
                }
            }

            if (MarkdownReader.Dizmo.load('showBack') === true) {
                window.showBack = function () {
                    dizmo.showBack();
                };
            }
            if (MarkdownReader.Dizmo.load('showFront') === true) {
                window.showFront = function () {
                    dizmo.showFront();
                };
            }

            var width = bundle.getAttribute('width');
            if (typeof width === 'number') {
                dizmo.setWidth(width);
            }
            var height = bundle.getAttribute('height');
            if (typeof height === 'number') {
                dizmo.setHeight(height);
            }

            window.MAIN = new MarkdownReader.Main();
        }
    });

    window.EVAL = eval;
});
