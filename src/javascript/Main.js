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

                    return marked.defaults.renderer.heading.call({
                        options: marked.defaults
                    }, text, level, raw);
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
        tocFlag: {
            is: 'rw', init: function () {
                return MarkdownReader.Dizmo.load('tocFlag', true);
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
        },
        setTocFlag: function (value) {
            this.dizmo.my.save('tocFlag', value);
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
                if (this.tocFlag === true) {
                    this.dizmo.my.setSize(750, 500);
                } else {
                    this.dizmo.my.setSize(500, 500);
                }
                this.onShowFront();
            } else {
                this.dizmo.my.setSize(500, 500);
                this.onShowBack();
            }
        },

        onShowFront: function () {
            var self = this;

            jQuery('style#css').remove();
            jQuery('style#extra').remove();
            jQuery('#front').empty()
                .append('<div id="md-logo" style="background-image: {0}"></div>'
                    .replace('{0}', 'url(style/images/tourguide-light.svg);'))
                .append('<div id="md-toc"><div id="md-toc-splitter"/></div>');

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
                        jQuery('#front').empty()
                            .append('<div id="content">{0}</div>'.replace(
                                '{0}', self.md2html.convert(value)))
                            .append('<div id="md-toc">{0}</div>'.replace(
                                '{0}', '<div id="md-toc-splitter"/>'));

                        if (jQuery('#pager').length > 0) {
                            jQuery('#pager-lhs').click(
                                self.onLhsPagerClick.bind(self));
                            jQuery('#pager-rhs').click(
                                self.onRhsPagerClick.bind(self));
                            self.showPage(function () {
                                return 0;
                            });
                        }

                        jQuery('#md-toc-splitter').click(function () {
                            if (self.tocFlag !== true) {
                                self.showToc();
                            } else {
                                self.hideToc();
                            }
                        });

                        self.initToc();
                    }
                });

                self.setUrlMd(urlMd);
            } else {
                self.setUrlMd(null);
            }
        },

        onShowBack: function () {
            this.dizmo.my.setTitle('Markdown Reader');
        },

        initToc: function () {
            var toc = jQuery('#md-toc > *');
            var array = jQuery('#content > *').not('#pager');
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                switch (item.tagName.toLowerCase()) {
                    case 'h1':
                        toc.append(
                            '<div class="md-toc-item md-toc-h1"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', item.id).replace('{1}', item.textContent));

                        break;
                    case 'h2':
                        toc.append(
                            '<div class="md-toc-item md-toc-h2"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', item.id).replace('{1}', item.textContent));
                        break;
                    case 'h3':
                        toc.append(
                            '<div class="md-toc-item md-toc-h3"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', item.id).replace('{1}', item.textContent));
                        break;
                    case 'h4':
                        toc.append(
                            '<div class="md-toc-item md-toc-h4"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', item.id).replace('{1}', item.textContent));
                        break;
                    case 'h5':
                        toc.append(
                            '<div class="md-toc-item md-toc-h5"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', item.id).replace('{1}', item.textContent));
                        break;
                    default:
                        break;
                }
            }

            if (this.tocFlag === true) {
                this.showToc();
            } else {
                this.hideToc();
            }

            jQuery('.md-toc-item').click(this.onTocItemClick);
        },

        showToc: function () {
            jQuery('.md-toc-item').css('border-bottom', 'lightgray solid 1px');
            this.dizmo.my.setSize(750, 500);
            this.setTocFlag(true);
        },

        hideToc: function () {
            jQuery('.md-toc-item').css('border-bottom', 'none');
            this.dizmo.my.setSize(500, 500);
            this.setTocFlag(false);
        },

        onLhsPagerClick: function () {
            this.showPage(function (page) {
                return (page - 1 >= 0) ? page - 1 : 0;
            });

            return false;
        },

        onRhsPagerClick: function () {
            this.showPage(function (page, pages) {
                return (page + 1 < pages) ? page + 1 : page;
            });

            return false;
        },

        onTocItemClick: function () {
            var ref = $(this).find('p').attr('ref'); (function () {
                console.debug ('[TOC-ITEM:CLICK] ref', ref);
            })();

            return false;
        },

        showPage: function (counter) {
            var groups = this.group(
                jQuery('#content > *').not('#pager'), function (item) {
                    return item.tagName.toLowerCase() == 'h2'.toLowerCase();
                }
            );

            if (counter !== undefined) {
                this.page = counter.call(this, this.page || 0, groups.length);
            } else {
                this.page = 0;
            }

            for (var index = 0; index < groups.length; index++) {
                if (index == this.page) {
                    jQuery(groups[index]).show();
                } else {
                    jQuery(groups[index]).hide();
                }
            }
        },

        group: function (array, by) {
            var groups = [], index = null;
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                if (by(item, index, i)) {
                    index = (index !== null) ? index + 1 : 0;
                }
                if (index !== null) {
                    if (groups[index] === undefined) {
                        groups[index] = [];
                    }

                    groups[index].push(item);
                }
            }

            return groups;
        }
    }
});
