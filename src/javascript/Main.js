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
                            jQuery(document).keydown(function (ev) {
                                var keyCode = ev.keyCode || ev.which;
                                if (keyCode == 37) { // left arrow
                                    self.onLhsPagerClick();
                                    return false;
                                }
                                if (keyCode == 39) { // right arrow
                                    self.onRhsPagerClick();
                                    return false;
                                }
                            });
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
                var el = array[i];
                switch (el.tagName) {
                    case 'H1':
                        toc.append(
                            '<div class="md-toc-item md-toc-h1"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent));
                        break;
                    case 'H2':
                        toc.append(
                            '<div class="md-toc-item md-toc-h2"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent));
                        break;
                    case 'H3':
                        toc.append(
                            '<div class="md-toc-item md-toc-h3"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent));
                        break;
                    case 'H4':
                        toc.append(
                            '<div class="md-toc-item md-toc-h4"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent));
                        break;
                    case 'H5':
                        toc.append(
                            '<div class="md-toc-item md-toc-h5"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent));
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

            jQuery('.md-toc-item').click(this.onTocItemClick.bind(this));
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

            jQuery('#content').animate({
                scrollTop: 0
            }, 0);

            return false;
        },

        onRhsPagerClick: function () {
            this.showPage(function (page, pages) {
                return (page + 1 < pages) ? page + 1 : page;
            });

            jQuery('#content').animate({
                scrollTop: 0
            }, 0);

            return false;
        },

        onTocItemClick: function (event) {
            var $content = jQuery('#content'),
                ref = jQuery(event.target).attr('ref');
            if (ref) {
                var $el = jQuery(ref), $header;
                if ($el.length > 0) {
                    switch ($el[0].tagName) {
                        case 'H1':
                        case 'H2':
                            $header = $el.nextAll('h3:first');
                            break;
                        case 'H3':
                            $header = $el;
                            break;
                        default:
                            $header = $el.prevAll('h3:first');
                    }

                    if (jQuery('#pager').length > 0) this.showPage(function () {
                        return $content.find('> h3').index($header);
                    }, false);

                    $content.animate({
                        scrollTop: $el.offset().top
                    }, 375);
                }
            }

            return false;
        },

        showPage: function (counter) {
            var $items = jQuery('#content > *'),
                $pages = jQuery('#content').find('> h3');

            var $h2s = this.group($items.not('#pager'), function (item) {
                return item.tagName == 'H2';
            });

            for (var z = 0; z < $h2s.length; z++) {
                $h2s[z].$h3s = this.group($h2s[z], function (item) {
                    return item.tagName == 'H3';
                });
            }

            if (counter !== undefined) {
                this.page = counter.call(this, this.page || 0, $pages.length);
            } else {
                this.page = 0;
            }

            var i = 0, j = 0, flag = {};
            for (var page = 0; page < $pages.length; page++) {
                if ($h2s[i].$h3s[j] === undefined) {
                    i += 1; j = 0;
                }

                var head = function (h2s) {
                    return jQuery(h2s).first('h2').nextUntil('h3').andSelf();
                };

                if (page == this.page) {
                    MarkdownReader.Dizmo.setTitle('{0}: {1}'
                        .replace('{0}', $items.first('h1').text())
                        .replace('{1}', jQuery($h2s[i]).first('h2').text()));

                    head($h2s[i]).show(); flag[i] = true;
                    jQuery($h2s[i].$h3s[j]).show();
                } else {
                    if (!flag[i]) head($h2s[i]).hide();
                    jQuery($h2s[i].$h3s[j]).hide();
                }

                j += 1;
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

            return jQuery(groups);
        }
    }
});
