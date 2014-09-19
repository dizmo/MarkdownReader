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
                var value = dizmo.privateStorage().getProperty(path);
                if (value !== undefined) {
                    return JSON.parse(value);
                }

                return default_value;
            },

            save: function (path, value) {
                if (value !== undefined && value !== null) {
                    dizmo.privateStorage().setProperty(
                        path, JSON.stringify(value)
                    );
                } else {
                    dizmo.privateStorage().deleteProperty(path);
                }
            },

            setTitle: function(value) {
                dizmo.setAttribute('title', value);
            },

            setSize: function(width, height) {
                assert (jQuery.type(width) === 'number');
                assert (jQuery.type(height) === 'number');

                dizmo.setSize(width, height);
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
        },

        setAttributes: function () {
            var resize = this.my.load('resize');
            if (typeof resize !== undefined) {
                dizmo.setAttribute('allowResize', Boolean(resize));
            }
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
