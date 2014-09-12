//= require Dizmo

Class("MarkdownReader.Main", {
    has: {
        md2html: {
            is: 'ro', init: function () {
                var renderer = new marked.Renderer();
                renderer.heading = function (text, level, raw) {
                    if (level === 1) {
                        MarkdownReader.Dizmo.setTitle(text);
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
        urlMd: {
            is: 'rw', init: function () {
                return MarkdownReader.Dizmo.load('urlMd');
            }
        },
        urlCss: {
            is: 'rw', init: function () {
                return MarkdownReader.Dizmo.load('urlCss');
            }
        },
        extraCss: {
            is: 'rw', init: function () {
                return MarkdownReader.Dizmo.load('extraCss');
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
            if (this.urlMd !== undefined) jQuery('#url-md').val(this.urlMd);
            if (this.urlCss !== undefined) jQuery('#url-css').val(this.urlCss);
            if (this.extraCss !== undefined) EDITOR.setValue(this.extraCss);

            this.onShowFront();
            this.initEvents();
        },

        setUrlMd: function (value) {
            this.dizmo.my.save('urlMd', value);
        },
        setUrlCss: function (value) {
            this.dizmo.my.save('urlCss', value);
        },
        setExtraCss: function (value) {
            this.dizmo.my.save('extraCss', value);
        }
    },

    methods: {
        initEvents: function () {
            jQuery('.done-btn').on('click', this.onClick.bind(this));
            jQuery(events).on('dizmo.turned', this.onTurn.bind(this));
        },

        onClick: function () {
            this.dizmo.my.showFront();
        },

        onTurn: function (dizmo, side) {
            if (side === 'front') {
                this.onShowFront();
            } else {
                this.onShowBack();
            }
        },

        onShowFront: function () {
            var self = this;

            jQuery('style#css').remove();
            jQuery('style#extra').remove();
            jQuery('#front').empty().append(
                '<div class="md-logo" style="background-image: {0}"></div>'
                    .replace('{0}', 'url(style/images/tourguide-light.svg);'));

            var extraCss = EDITOR.getValue();
            if (extraCss && extraCss.length > 0) {
                self.setExtraCss(extraCss);
            } else {
                self.setExtraCss(null);
            }

            var urlCss = jQuery('#url-css').val();
            if (urlCss && urlCss.length > 0) {
                jQuery.ajax({
                    type: 'GET', url: urlCss, success: function (value) {
                        jQuery('head').append(
                                '<style id="css">' + value + '</style>');
                    }
                }).always(function () {
                    jQuery('head').append(
                            '<style id="extra">' + extraCss + '</style>');
                });
                self.setUrlCss(urlCss);
            } else {
                jQuery('head').append(
                        '<style id="extra">' + extraCss + '</style>');
                self.setUrlCss(null);
            }

            var urlMd = jQuery('#url-md').val();
            if (urlMd && urlMd.length > 0) {
                jQuery.ajax({
                    type: 'GET', url: urlMd, success: function (value) {
                        jQuery('#front').empty().append(
                            '<div id="content">{0}</div>'.replace(
                                '{0}', self.md2html.convert(value)));
                    }
                });
                self.setUrlMd(urlMd);
            } else {
                self.setUrlMd(null);
            }
        },

        onShowBack: function () {
            this.dizmo.my.setTitle('Markdown Reader');
        }
    }
});
