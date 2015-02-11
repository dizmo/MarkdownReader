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
                if (value !== undefined) {
                    return JSON.parse(value);
                }

                return default_value;
            },

            save: function (path, value) {
                if (value !== undefined && value !== null) {
                    dizmo.privateStorage.setProperty(
                        path, JSON.stringify(value));
                } else {
                    dizmo.privateStorage.deleteProperty(path);
                }
            },

            setTitle: function (value) {
                /*dizmo.setAttribute('title', value);*/ // TODO: API?
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
                var language = /*viewer.getAttribute ('language') || */'en', // TODO: API?
                    languages = dizmo.privateStorage.getProperty('languages');
                try {
                    languages = JSON.parse (languages);
                } catch (ex) {
                    languages = {en: "en"};
                }

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
            /*viewer.subscribeToAttribute('displayMode', function(path, val) { // TODO: API?
                if (val === 'presentation') {
                    dizmo.setAttribute('hideframe', true);
                } else {
                    dizmo.setAttribute('hideframe', false);
                }

                jQuery(events).trigger('dizmo.onmodechanged', [val]);
            });*/
            /*viewer.subscribeToAttribute('language', function(path, val) { // TODO: API?
                jQuery(events).trigger('dizmo.onlanguagechanged', [val]);
            });*/
        },

        setAttributes: function () {
            var resize = this.my.load('resize');
            /*if (typeof resize !== undefined) {
                dizmo.setAttribute('allowResize', Boolean(resize)); // TODO: API?
            }*/
            var width = parseInt(this.my.load('width'));
            if (!isNaN(width)) {
                dizmo.setAttribute('geometry/width', width);
            }
            var height = parseInt(this.my.load('height'));
            if (!isNaN(height)) {
                dizmo.setAttribute('geometry/height', height);
            }
        }
    }
});
