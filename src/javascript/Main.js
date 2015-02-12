//= require Dizmo
//= require MarkdownReader
//= require VideoConverter

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
                renderer.html = function (html) {
                    if (jQuery(html).prop ('tagName') === 'VIDEO') {
                        if (navigator.platform.indexOf('Linux x86_64') >= 0 ||
                            navigator.platform.indexOf('Mac') >= 0) {
                            html = MarkdownReader.VideoConverter.toBase64(html);
                        } else {
                            html = MarkdownReader.VideoConverter.toFlash(html);
                        }
                    }

                    return html;
                };

                return {
                    convert: function (mdValue) {
                        return marked(mdValue, {renderer: renderer});
                    }
                };
            }
        },
        urlBundleId: {
            is: 'ro', init: function () {
                return MarkdownReader.Dizmo.load(
                    'urlBundleId', 'http://store.dizmo.com/?bid=');
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
            if (!!this.urlMd) jQuery('#url-md').val(this.urlMd);
            if (!!this.urlCss) jQuery('#url-css').val(this.urlCss);
            if (!!this.extraCss) EDITOR.setValue(this.extraCss);

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
            jQuery('.done-btn').on('click',
                this.onClick.bind(this));
            jQuery(events).on('dizmo.turned',
                this.onTurn.bind(this));
            jQuery(events).on('dizmo.onlanguagechanged',
                this.onLanguageChanged.bind(this));
        },

        onClick: function () {
            this.dizmo.my.showFront();
        },

        onLanguageChanged: function (dizmo, language) {
            this.onTurn(dizmo, 'front');
        },

        onTurn: function (dizmo, side) {
            if (side === 'front') {
                if (this.tocFlag === true) {
                    this.dizmo.my.setSize(950, this.dizmo.my.getHeight());
                } else {
                    this.dizmo.my.setSize(696, this.dizmo.my.getHeight());
                }
                this.onShowFront();
            } else {
                this.dizmo.my.setSize(696, this.dizmo.my.getHeight());
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
                .append('<div id="md-toc"><div id="md-toc-items"/></div>');

            var extraCss = EDITOR.getValue();
            if (extraCss && extraCss.length > 0) {
                self.setExtraCss(extraCss);
            } else {
                self.setExtraCss(null);
            }

            var resolve = function (url) {
                return (url !== undefined)
                    ? url.replace ('${LANGUAGE}', self.dizmo.my.getLanguage())
                    : url;
            };

            var urlCss = jQuery('#url-css').val();
            if (urlCss && urlCss.length > 0) {
                jQuery.ajax({
                    type: 'GET', url: resolve (urlCss), success: function (value) {
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
                    type: 'GET', url: resolve (urlMd), success: function (value) {
                        jQuery('#front').empty()
                            .append('<div id="content">{0}</div>'
                                .replace('{0}', self.md2html.convert(value)))
                            .append('<div id="md-toc">{0}{1}</div>'
                                .replace('{0}', '<div class="searchfield">{0}</div>'
                                    .replace ('{0}', '<input ' +
                                        'id="md-toc-search" ' +
                                        'data-type="dizmo-input" type="text" ' +
                                        'class="searchinput" ' +
                                    '/>'))
                                .replace('{1}', '<div id="md-toc-items"/>'));

                        if (jQuery('#pager').length > 0) {
                            jQuery('#pager-lhs').click(
                                self.onLhsPagerClick.bind(self));
                            jQuery('#pager-rhs').click(
                                self.onRhsPagerClick.bind(self));
                            jQuery(document).keydown(function (ev) {
                                var display = jQuery('#front').css('display');
                                if (display === 'block') {
                                    var keyCode = ev.keyCode || ev.which;
                                    if (keyCode == 37) { // left arrow
                                        self.onLhsPagerClick();
                                        return false;
                                    }
                                    if (keyCode == 39) { // right arrow
                                        self.onRhsPagerClick();
                                        return false;
                                    }
                                }
                            });

                            self.showPage(function (page, pages, result) {
                                result.call(this, 0);
                            });
                        }

                        jQuery('#content').find('a').click(function (ev) {
                            var $target = jQuery(ev.target);
                            var href = $target.attr('href');

                            if (href.indexOf(self.urlBundleId) === 0) {
                                var bid = href.replace(self.urlBundleId, '');
                                var bundles = viewer.getInstalledBundles();

                                if (bundles.indexOf (bid) > 0) {
                                    viewer.instantiateDizmo(bid);
                                } else {
                                    var bid_store = 'com.dizmo.dizmostore';
                                    if (bundles.indexOf (bid_store) > 0) {
                                        viewer.instantiateDizmo(bid_store);
                                    }
                                }

                                return false;
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
            var self = this;
            var tocs = jQuery('#md-toc-items');
            var array = jQuery('#content > *').not('#pager');
            for (var i = 0; i < array.length; i++) {
                var el = array[i];
                switch (el.tagName) {
                    case 'H1':
                        tocs.append(
                            '<div class="md-toc-item md-toc-h1"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent));
                        break;
                    case 'H2':
                        tocs.append(
                            '<div class="md-toc-item md-toc-h2"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent));
                        break;
                    case 'H3':
                        tocs.append(
                            '<div class="md-toc-item md-toc-h3"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent));
                        break;
                    case 'H4':
                        tocs.append(
                            '<div class="md-toc-item md-toc-h4"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent));
                        break;
                    case 'H5':
                        tocs.append(
                            '<div class="md-toc-item md-toc-h5"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent));
                        break;
                    default:
                        break;
                }
            }

            if (self.tocFlag === true) {
                self.showToc();
            } else {
                self.hideToc();
            }

            dizmo.addMenuItem('/style/images/toc.svg', 'Table of Contents', function () {
                if (self.tocFlag !== true) {
                    self.showToc();
                } else {
                    self.hideToc();
                }
            });

            jQuery('#md-toc-search').keyup(function (ev) {
                var keyCode = ev.keyCode || ev.which;
                if (keyCode == 27) { // escape
                    jQuery('.md-toc-item').each(function (index, item) {
                        jQuery(item).show();
                    });

                    jQuery('#md-toc-search').val('');
                } else {
                    var rx = new RegExp(jQuery('#md-toc-search').val(), 'i');
                    jQuery('.md-toc-item').each(function (index, item) {
                        var $item = jQuery(item);
                        if (rx.source.length > 0 && index > 0) {
                            var text = $item.find('p').text();
                            if (text.match(rx)) {
                                $item.show();
                            } else {
                                $item.hide();
                            }
                        } else {
                            $item.show();
                        }
                    });
                }
            });

            var $tocItems =jQuery('.md-toc-item');
            $tocItems.click(self.onTocItemClick.bind(self));
            this.highlight($tocItems.first());
        },

        showToc: function () {
            jQuery('.md-toc-item').css('border-bottom', 'lightgray solid 1px');
            this.dizmo.my.setSize(950, this.dizmo.my.getHeight());
            this.setTocFlag(true);
        },

        hideToc: function () {
            jQuery('.md-toc-item').css('border-bottom', 'none');
            this.dizmo.my.setSize(696, this.dizmo.my.getHeight());
            this.setTocFlag(false);
        },

        onLhsPagerClick: function () {
            if (typeof MarkdownReader.my.lhsPageTo === 'function') {
                this.showPage(MarkdownReader.my.lhsPageTo);
            } else {
                this.showPage(function (page, pages, go) {
                    go.call(this, (page - 1 >= 0) ? page - 1 : 0, page);
                });
            }

            jQuery('#content').animate({
                scrollTop: 0
            }, 0);

            this.highlight(jQuery(jQuery('.md-toc-h3')[this.page]));
            return false;
        },

        onRhsPagerClick: function () {
            if (typeof MarkdownReader.my.rhsPageTo === 'function') {
                this.showPage(MarkdownReader.my.rhsPageTo);
            } else {
                this.showPage(function (page, pages, go) {
                    go.call (this, (page + 1 < pages) ? page + 1 : page, page);
                });
            }

            jQuery('#content').animate({
                scrollTop: 0
            }, 0);

            this.highlight(jQuery(jQuery('.md-toc-h3')[this.page]));
            return false;
        },

        onTocItemClick: function (event) {
            var $content = jQuery('#content'),
                $pager = jQuery('#pager');

            var ref = jQuery(event.target).attr('ref');
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

                    if ($pager.length > 0) {
                        this.showPage(function (page, pages, next) {
                            page = $content.find('> h3').index($header);
                            next.call(this, page);
                        }, false);
                    }

                    $content.animate({
                        scrollTop: $el.offset().top
                    }, 375);

                    this.highlight(jQuery(event.target).parent());
                }
            }

            return false;
        },

        highlight: function ($tocItem) {
            jQuery('.md-toc-item').css ('background-color', '');
            $tocItem.css ('background-color', '#e5e5e5');
        },

        showPage: function (counter) {
            var $items = jQuery('#content > *'),
                $pages = jQuery('#content').find('> h3'),
                $pager = jQuery('#pager');

            var $h2s = this.group($items.not('#pager'), function (item) {
                return item.tagName == 'H2';
            });

            for (var z = 0; z < $h2s.length; z++) {
                $h2s[z].$h3s = this.group($h2s[z], function (item) {
                    return item.tagName == 'H3';
                });
            }

            var self = this, go = function (new_page, old_page) {
                if ($pager.length > 0 && new_page !== old_page) {
                    $pager.trigger('turn:before', [new_page, old_page]);
                }

                var min_page = 0;
                jQuery('#pager-lhs').attr('disabled', new_page == min_page);
                var max_page = $pages.length - 1;
                jQuery('#pager-rhs').attr('disabled', new_page == max_page);

                var i = 0, j = 0, flag = {};
                for (var page = 0; page < $pages.length; page++) {
                    if ($h2s[i].$h3s[j] === undefined) {
                        i += 1; j = 0;
                    }

                    var head = function (h2s) {
                        return jQuery(h2s).first('h2').nextUntil('h3').andSelf();
                    };

                    if (page == new_page) {
                        var h1_text = $items.first('h1').text(),
                            h2_text = jQuery($h2s[i]).first('h2').text();

                        if (h2_text.length > 0 && h2_text != ' ') {
                            MarkdownReader.Dizmo.setTitle('{0}: {1}'.replace(
                                '{0}', h1_text).replace('{1}', h2_text));
                        } else {
                            MarkdownReader.Dizmo.setTitle('{0}'.replace(
                                '{0}', h1_text));
                        }

                        flag[i] = true; MarkdownReader.VideoConverter
                            .b64Unwrap(head($h2s[i])).show();
                        MarkdownReader.VideoConverter
                            .b64Unwrap(jQuery($h2s[i].$h3s[j])).show();
                    } else {
                        if (!flag[i]) MarkdownReader.VideoConverter
                            .b64Rewrap(head($h2s[i]), ['VIDEO'])
                            .hide();
                        MarkdownReader.VideoConverter
                            .b64Rewrap(jQuery($h2s[i].$h3s[j]), ['VIDEO'])
                            .hide();
                    }

                    j += 1;
                }

                if ($pager.length > 0 && new_page !== old_page) {
                    $pager.trigger('turn:after', [new_page, old_page]);
                }

                return self.page = new_page;
            };

            if (typeof counter === 'function') {
                counter.call(this, this.page||0, $pages.length, go);
            } else {
                go(this.page||0, this.page);
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
