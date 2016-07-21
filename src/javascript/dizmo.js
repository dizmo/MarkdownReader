Class("MarkdownReader.Dizmo", {
    my: {
        methods: {
            load: function (path, fallback) {
                return dizmo.privateStorage.getProperty(path, {
                    fallback: fallback
                });
            },
            save: function (path, value) {
                if (value === undefined) {
                    dizmo.privateStorage.deleteProperty(path);
                } else {
                    dizmo.privateStorage.setProperty(path, value);
                }
            },

            language: function () {
                var l = viewer.getAttribute('settings/language') || 'en',
                    ls = this.load('languages', {en: "en"});

                return ls[l] || 'en';
            }
        }
    },

    after: {
        initialize: function () {
            this.initAttributes();
            this.initEvents();
        }
    },

    methods: {
        initAttributes: function () {
            dizmo.setAttribute('settings/usercontrols/allowresize', false);

            var w = dizmo.getWidth(),
                h = dizmo.getHeight();

            dizmo.setAttribute('geometry/width', w);
            dizmo.setAttribute('geometry/height', h);

            var $html = jQuery('html');
            $html.css('height', h - 16);
            $html.css('width', w - 16);

            var $body = jQuery('body');
            $body.css('height', h - 16);
            $body.css('width', w - 16);
        },

        initEvents: function () {
            dizmo.onShowBack(function () {
                jQuery("#front").hide();
                jQuery("#back").show();
                jQuery(events).trigger('dizmo.turned', ['back']);
            });

            dizmo.onShowFront(function () {
                jQuery("#back").hide();
                jQuery("#front").show();
                jQuery(events).trigger('dizmo.turned', ['front']);
            });

            dizmo.subscribeToAttribute('settings/framecolor', function (path, value) {
                jQuery(events).trigger('dizmo.framecolor', [value]);
            });

            viewer.subscribeToAttribute(
                'settings/displaymode', function (path, value) {
                    dizmo.setAttribute(
                        'state/framehidden', value === 'presentation');
                }
            );

            viewer.subscribeToAttribute(
                'settings/language', function(path, value) {
                    jQuery(events).trigger('dizmo.onlanguagechanged', [value]);
                }
            );
        }
    }
});
