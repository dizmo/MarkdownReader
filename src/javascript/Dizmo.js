//= require Assert

Class("MarkdownReader.Dizmo", {
    my: {
        methods: {
            showBack: function () {
                dizmo.showBack();
            },

            showFront: function () {
                dizmo.showFront();
            },

            load: function (path, default_value) {
                var value = dizmo.privateStorage.getProperty(path);
                if (value !== undefined && value !== null) {
                    try {
                        return JSON.parse(value);
                    } catch (ex) {
                        return value;
                    }
                }

                return default_value;
            },

            save: function (path, value) {
                if (value !== undefined && value !== null) {
                    dizmo.privateStorage
                        .setProperty(path, JSON.stringify(value));
                } else {
                    dizmo.privateStorage.deleteProperty(path);
                }
            },

            setTitle: function (value) {
                dizmo.setAttribute('settings/title', value);
            },

            setSize: function (width, height) {
                assert (jQuery.type(width) === 'number');
                assert (jQuery.type(height) === 'number');

                dizmo.setSize(width, height);
            },

            getHeight: function() {
                return dizmo.getHeight();
            },

            getWidth: function() {
                return dizmo.getWidth();
            },

            getLanguage: function () {
                var language = viewer.getAttribute('settings/language')||'en',
                    languages = this.load('languages', {en: "en"});

                return languages[language]||'en';
            }
        }
    },

    after: {
        initialize: function () {
            this.setAttributes();
            this.initEvents();
        }
    },

    methods: {
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
            viewer.subscribeToAttribute(
                'settings/displayMode', function(path, value) {
                    if (value === 'presentation') {
                        dizmo.setAttribute('hideframe', true);
                    } else {
                        dizmo.setAttribute('hideframe', false);
                    }

                    jQuery(events).trigger('dizmo.onmodechanged', [value]);
                }
            );
            viewer.subscribeToAttribute(
                'settings/language', function(path, value) {
                    jQuery(events).trigger('dizmo.onlanguagechanged', [value]);
                }
            );

            dizmo.onDock(function (dizmo) {
             // console.debug('[ON:DOCK]', arguments);
            });

            dizmo.onUndock(function (dizmo) {
             // console.debug('[ON:UNDOCK]', arguments);
            });

            dizmo.canDock(false);
        },

        setAttributes: function () {
            dizmo.setAttribute('settings/usercontrols/allowresize', false);

            var w = dizmo.getWidth();
            assert(w > 0);
            var h = dizmo.getHeight();
            assert(h > 0);

            dizmo.setAttribute('geometry/width', w);
            dizmo.setAttribute('geometry/height', h);

            var $html = jQuery('html');
            $html.css('height', h - 16);
            $html.css('width', w - 16);

            var $body = jQuery('body');
            $body.css('height', h - 16);
            $body.css('width', w - 16);
        }
    }
});
