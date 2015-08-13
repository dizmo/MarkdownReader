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
                if (value === null) {
                    return undefined || default_value;
                } else if (value === '"null"') {
                    return null;
                } else {
                    return value;
                }
            },

            save: function (path, value) {
                if (value === undefined) {
                    dizmo.privateStorage.deleteProperty(path);
                } else if (value === null) {
                    dizmo.privateStorage.setProperty(path, '"null"');
                } else {
                    dizmo.privateStorage.setProperty(path, value);
                }
            },

            setTitle: function (value) {
                dizmo.setAttribute('settings/title', value);
            },

            setSize: function (width, height) {
                dizmo.setSize(width, height);
            },

            getHeight: function () {
                return dizmo.getHeight();
            },

            setHeight: function (value) {
                return dizmo.setHeight(value);
            },

            getWidth: function () {
                return dizmo.getWidth();
            },

            setWidth: function (value) {
                return dizmo.setWidth(value);
            },

            getLanguage: function () {
                var language = viewer.getAttribute('settings/language') || 'en',
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

            dizmo.subscribeToAttribute('settings/framecolor', function (path, value) {
                jQuery(events).trigger('dizmo.framecolor', [value]);
            });

            viewer.subscribeToAttribute(
                'settings/displaymode', function (path, value) {
                    if (value === 'presentation') {
                        dizmo.setAttribute('state/framehidden', true);
                    } else {
                        dizmo.setAttribute('state/framehidden', false);
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
