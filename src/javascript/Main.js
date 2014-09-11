//= require Dizmo

Class("MarkdownReader.Main", {
    has: {
        md2html: {
            is: 'ro', init: function () {
                var renderer = new marked.Renderer();
                renderer.heading = function (text, level, raw) {
                    if (level === 1) {
                        dizmo.setAttribute('title', text);
                    }

                    return marked.defaults.renderer.heading(text, level, raw);
                };

                return {
                    convert: function (mdValue) {
                        return marked(mdValue, {renderer: renderer});
                    }
                };
            }
        },
        dizmo: {
            is: 'ro', init: function () {
                return DIZMO = new MarkdownReader.Dizmo();
            }
        }
    },

    after: {
        initialize: function () {
            this.initEvents();
        }
    },

    methods: {
        initEvents: function () {
            jQuery('#url').keyup(this.onKeyup.bind(this));
            jQuery('.done-btn').on('click', this.onClick.bind(this));
            jQuery(events).on('dizmo.turned', this.onTurn.bind(this));
        },

        onClick: function () {
            this.dizmo.my.showFront();
        },

        onKeyup: function () {
        },

        onTurn: function (dizmo, side) {
            if (side === 'front') {
                this.onShowFront.call(this);
            } else {
                this.onShowBack.call(this);
            }
        },

        onShowFront: function () {
            var self = this;

            jQuery('style#css').remove();
            jQuery('style#extra').remove();
            jQuery('#front').empty().append(
                '<div class="md-logo" style="background-image: {0}"></div>'
                    .replace('{0}', 'url(style/images/tourguide-light.svg);'));


            var cssUrl = jQuery('#css-url').val();
            if (cssUrl && cssUrl.length > 0) {
                jQuery.ajax({
                    type: 'GET', url: cssUrl, success: function (value) {
                        jQuery('head').append(
                            '<style id="css">' + value + '</style>');
                    }
                }).always(function () {
                    jQuery('head').append(
                        '<style id="extra">' + EDITOR.getValue() + '</style>');
                });
            } else {
                jQuery('head').append(
                    '<style id="extra">' + EDITOR.getValue() + '</style>');
            }

            var mdUrl = jQuery('#md-url').val();
            if (mdUrl && mdUrl.length > 0) {
                jQuery.ajax({
                    type: 'GET', url: mdUrl, success: function (value) {
                        jQuery('#front').empty().append(
                            '<div id="content">{0}</div>'.replace(
                                '{0}', self.md2html.convert(value)));
                    }
                });
            }
        },

        onShowBack: function () {
            this.dizmo.my.setTitle('Markdown Reader');
        }
    }
});
