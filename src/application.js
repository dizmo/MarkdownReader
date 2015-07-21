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
            var css_rule = function (selector, property, parser) {
                var sheets = document.styleSheets;
                for (var s in sheets) {
                    if (sheets.hasOwnProperty(s)) {
                        var rules = sheets[s].rules;
                        for (var r in rules) {
                            if (rules.hasOwnProperty(r)) {
                                var rule = rules[r];
                                if (rule.selectorText === selector) {
                                    if (property) {
                                        var value = rule.style[property];
                                        if (parser) {
                                            return parser(value);
                                        } else {
                                            return value;
                                        }
                                    } else {
                                        return rule;
                                    }
                                }
                            }
                        }
                    }
                }
            };

            var d = css_rule('#front #md-toc', 'width', parseInt),
                w = MarkdownReader.Dizmo.getWidth(),
                h = MarkdownReader.Dizmo.getHeight();

            MarkdownReader.Dizmo.setSize(w - d, h);
        }

        window.MAIN = new MarkdownReader.Main();
    });
});
