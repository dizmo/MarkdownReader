//= require Dizmo
//= require Editor
//= require MarkdownReader
//= require VideoConverter

Class("MarkdownReader.Main", {

    my: {
        methods: {
            language: function (tpl) {
                if (typeof tpl === 'string') {
                    return tpl.replace (
                        '${LANGUAGE}', MarkdownReader.Dizmo.my.getLanguage());
                } else {
                    return tpl;
                }
            },
            resolve: function (href) {
                if (!href.match(/^\//) && !href.match(/^[a-z]+:\/\//i)) {
                    var tpl_md = MarkdownReader.Dizmo.load('urlMd'),
                        url_md = MarkdownReader.Main.language(tpl_md),
                        idx_md = url_md.split('/').pop();

                    return url_md.replace(idx_md, '') + href;
                } else {
                    return href;
                }
            }
        }
    },

    has: {
        scroll1: {
            is: 'rw', init: function () {
                return undefined;
            }
        },
        scroll1Opts: {
            is: 'ro', init: function () {
                return MarkdownReader.Dizmo.load('scroll1', false);
            }
        },
        scroll2: {
            is: 'rw', init: function () {
                return undefined;
            }
        },
        scroll2Opts: {
            is: 'ro', init: function () {
                return MarkdownReader.Dizmo.load('scroll2', {
                    "fadeScrollbars": false,
                    "interactiveScrollbars": true,
                    "mouseWheel": true,
                    "scrollbars": "custom",
                    "shrinkScrollbars": "scale"
                });
            }
        },
        editor: {
            is: 'ro', init: function () {
                window.EDITOR = new MarkdownReader.Editor();
                return window.EDITOR;
            }
        },
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

                renderer.image = function (href, title, text) {
                    return marked.defaults.renderer.image.call({
                        options: marked.defaults
                    }, MarkdownReader.Main.resolve(href), title, text);
                };
                renderer.link = function (href, title, text) {
                    return marked.defaults.renderer.link.call({
                        options: marked.defaults
                    }, MarkdownReader.Main.resolve(href), title, text);
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
                return MarkdownReader.Dizmo.load('tocFlag', null);
            }
        },
        dizmo: {
            is: 'ro', init: function () {
                window.DIZMO = new MarkdownReader.Dizmo();
                return window.DIZMO;
            }
        },
        width: {
            is: 'ro', init: function () {
                return MarkdownReader.Dizmo.load('width', undefined);
            }
        },
        height: {
            is: 'ro', init: function () {
                return MarkdownReader.Dizmo.load('height', undefined);
            }
        }
    },

    after: {
        initialize: function () {
            if (!!this.urlMd) jQuery('#url-md').val(this.urlMd);
            if (!!this.urlCss) jQuery('#url-css').val(this.urlCss);
            if (!!this.extraCss) this.editor.setValue(this.extraCss);

            this.onShowFront();
            this.initEvents();
        },

        setUrlMd: function (value) {
            MarkdownReader.Dizmo.save('urlMd', value);
        },
        setUrlCss: function (value) {
            MarkdownReader.Dizmo.save('urlCss', value);
        },
        setExtraCss: function (value) {
            MarkdownReader.Dizmo.save('extraCss', value);
        },
        setTocFlag: function (value) {
            MarkdownReader.Dizmo.save('tocFlag', value);
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
            jQuery(events).on('dizmo.framecolor',
                this.onFrameColorChanged.bind(this));
        },

        onClick: function () {
            this.dizmo.my.showFront();
        },

        onLanguageChanged: function (dizmo, language) {
            this.onTurn(dizmo, 'front');
        },

        onFrameColorChanged: function (dizmo, framecolor) {
            jQuery('#md-toc').css(
                'color', this.getAdaptiveColor(framecolor));
            jQuery('#content').find(':header,p').css(
                'color', this.getAdaptiveColor(framecolor));
            jQuery('#pager-idx').css(
                'color', this.getAdaptiveColor(framecolor));
            jQuery('#pager-lhs').css(
                '-webkit-filter', this.getAdaptiveInversion(framecolor));
            jQuery('#pager-rhs').css(
                '-webkit-filter', this.getAdaptiveInversion(framecolor));
        },

        getAdaptiveColor: function (framecolor) {
            try {
                return (Colors.hex2bright(framecolor.slice(0,7))) ?
                    '#3d3d3d' : '#e6e6e6';
            } catch (ex) {
                console.error(ex);
            }

            return '#3d3d3d';
        },

        getAdaptiveInversion: function (framecolor) {
            try {
                return (Colors.hex2bright(framecolor.slice(0,7))) ?
                    'invert(0.0)' : 'invert(1.0)';
            } catch (ex) {
                console.error(ex);
            }

            return 'invert(0.0)';
        },

        onTurn: function (dizmo, side, opts) {
            if (side === 'front') {
                this.onShowFront(opts.no_resize);
            } else {
                this.onShowBack(opts.no_resize);
            }
        },

        refresh: function () {
            this.onShowFront({no_resize: true});
        },

        onShowFront: function (opts) {
            var self = this;

            jQuery('style#css').remove();
            jQuery('style#extra').remove();
            jQuery('#front').empty()
                .append('<div id="md-logo" style="background-image: {0}"></div>'
                    .replace('{0}', 'url(style/images/tourguide-light.svg);'))
                .append('<div id="md-toc"><div id="md-toc-items"/></div>');

            var extraCss = this.editor.getValue();
            if (extraCss && extraCss.length > 0) {
                self.setExtraCss(extraCss);
            } else {
                self.setExtraCss(null);
            }

            var urlCss = jQuery('#url-css').val();
            if (urlCss && urlCss.length > 0) {
                jQuery.ajax({
                    type: 'GET', url: MarkdownReader.Main.language(urlCss),
                    success: function (value) {
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
            if (urlMd && urlMd.length > 0) setTimeout(function () {
                jQuery.ajax({
                    type: 'GET', url: MarkdownReader.Main.language(urlMd),
                    success: function (value) {
                        jQuery('#front').empty()
                            .append('<div id="content-wrap"><div id="content">{0}</div></div>'
                                .replace('{0}', self.md2html.convert(value)))
                            .append('<div id="md-toc">{0}{1}</div>'
                                .replace('{0}', '<div class="searchfield">{0}{1}</div>'
                                    .replace('{0}', '<button id="md-toc-home" ' +
                                        'data-type="dizmo-button" rel="help">&nbsp;</button>')
                                    .replace ('{1}', '<input ' +
                                        'id="md-toc-search" ' +
                                        'data-type="dizmo-searchfield" type="search" ' +
                                        'class="searchinput" ' +
                                    '/>'))
                                .replace('{1}', '<div id="md-toc-items-wrap">' +
                                    '<div id="md-toc-items"></div></div>'));

                        var $pager = jQuery('#pager');
                        if ($pager.length > 0) {
                            $pager.appendTo('#front');
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
                                    }
                                    if (keyCode == 39) { // right arrow
                                        self.onRhsPagerClick();
                                    }
                                }
                            });

                            self.showPage(function (page, pages, go) {
                                go.call(this, 0);
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

                        jQuery(events).trigger('dizmo.framecolor',
                            dizmo.getAttribute('settings/framecolor'));

                        if (self.scroll1 !== undefined) {
                            self.scroll1.destroy();
                            self.scroll1 = undefined;
                        }

                        if (self.scroll2 !== undefined) {
                            self.scroll2.destroy();
                            self.scroll2 = undefined;
                        }

                        if (self.scroll1Opts) setTimeout(function () {
                            jQuery(
                                '#content-wrap').addClass('no-dizmo-drag');
                            self.scroll1 = new IScroll(
                                '#content-wrap', self.scroll1Opts);
                        }, 95);

                        if (self.scroll2Opts) setTimeout(function () {
                            jQuery(
                                '#md-toc-items-wrap').addClass('no-dizmo-drag');
                            self.scroll2 = new IScroll(
                                '#md-toc-items-wrap', self.scroll2Opts);
                        }, 97);

                        self.initToc(opts);
                    }
                });

                self.setUrlMd(urlMd);
            }, 1); else {
                self.setUrlMd(null);
            }
        },

        onShowBack: function (opts) {
            this.dizmo.my.setTitle('Markdown Reader');
            this.editor.refresh();

            if (this.tocFlag) this.hideToc(opts);
        },

        initToc: function (opts) {
            var self = this, tocs = jQuery('#md-toc-items'),
                array = jQuery('#content > *').not('#pager');
            for (var i = 0; i < array.length; i++) {
                var el = array[i];
                switch (el.tagName) {
                    case 'H1':
                        tocs.append(
                            '<div id="{id}" class="md-toc-item md-toc-h1"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent)
                                .replace('{id}', 'toc-' + i));
                        break;
                    case 'H2':
                        tocs.append(
                            '<div id="{id}" class="md-toc-item md-toc-h2"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent)
                                .replace('{id}', 'toc-' + i));
                        break;
                    case 'H3':
                        tocs.append(
                            '<div id="{id}" class="md-toc-item md-toc-h3"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent)
                                .replace('{id}', 'toc-' + i));
                        break;
                    case 'H4':
                        tocs.append(
                            '<div id="{id}" class="md-toc-item md-toc-h4"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent)
                                .replace('{id}', 'toc-' + i));
                        break;
                    case 'H5':
                        tocs.append(
                            '<div id="{id}" class="md-toc-item md-toc-h5"><p ref="#{0}">{1}</p></div>'
                                .replace('{0}', el.id).replace('{1}', el.textContent)
                                .replace('{id}', 'toc-' + i));
                        break;
                    default:
                        break;
                }
            }

            if (self.tocFlag !== null) {
                var toggle_toc = function () {
                    if (jQuery('#front').css('display') !== 'none') {
                        if (self.tocFlag !== true) {
                            self.showToc(opts);
                        } else {
                            self.hideToc(opts);
                        }

                        self.setTocFlag(!self.tocFlag);
                    }
                };

                dizmo.addMenuItem(
                    '/style/images/toc.svg', 'Table of Contents', toggle_toc);
            }

            var $toc_home = jQuery('#md-toc-home');
            $toc_home.on('click', function (ev) {
                self.showPage(function (page, pages, go) {
                    go.call(this, 0);
                });
            });

            var $toc_search = jQuery('#md-toc-search');
            $toc_search.on('input', function (ev) {
                if (jQuery('#md-toc-search').val() === '') {
                    jQuery('.md-toc-item:has(p:not(:empty))').each(function () {
                        jQuery(this).show();
                    });

                    if (self.scroll2 !== undefined) {
                        self.scroll2.refresh();
                    }
                }
            });

            $toc_search.keyup(function (ev) {
                var keyCode = ev.keyCode || ev.which;
                if (keyCode == 27) { // escape
                    jQuery('.md-toc-item:has(p:not(:empty))').each(function () {
                        jQuery(this).show();
                    });

                    jQuery('#md-toc-search').val('');
                } else {
                    var rx = new RegExp(jQuery('#md-toc-search').val(), 'i');
                    jQuery('.md-toc-item:has(p:not(:empty))').each(function (i) {
                        var $item = jQuery(this);
                        if (rx.source.length > 0 && i > 0) {
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

                    if (self.scroll2 !== undefined) {
                        self.scroll2.refresh();
                    }
                }
            });

            var $tocItems = jQuery('.md-toc-item');
            $tocItems.click(self.onTocItemClick.bind(self)).each(function () {
                if (jQuery(this).find('p:empty').length > 0) {
                    jQuery(this).hide();
                }
            });

            this.highlight($tocItems.first());
            if (self.tocFlag) self.showToc(opts);
        },

        showToc: function (opts) {
            var $toc_list = DizmoElements('#md-toc'),
                $toc_item = $toc_list.find('.md-toc-item');

            var self = this; setTimeout(function () {
                if (!opts || !opts.no_resize) {
                    var w = self.dizmo.my.getWidth(),
                        h = self.dizmo.my.getHeight();

                    self.dizmo.my.setSize(w + $toc_list.width(), h);
                }

                jQuery('html, body').css('width', '100%');
                jQuery('#content-wrap').css('width', 'calc(100% - 270px)');

                $toc_item.css('border-bottom', 'lightgray solid 1px');
                $toc_list.show();
            }, 0);

            var $toc_home = $toc_list.find('#md-toc-home');
            $toc_home.dbutton();

            var $toc_search = $toc_list.find('#md-toc-search');
            $toc_search.dsearchfield();
            $toc_search.focus();
        },

        hideToc: function (opts) {
            var $toc_list = DizmoElements('#md-toc'),
                $toc_item = $toc_list.find('.md-toc-item');

            var self = this; setTimeout(function () {
                if (!opts || !opts.no_resize) {
                    var w = self.dizmo.my.getWidth(),
                        h = self.dizmo.my.getHeight();

                    self.dizmo.my.setSize(w - $toc_list.width(), h);
                }

                jQuery('html, body').css('width', '100%');
                jQuery('#content-wrap').css('width', 'calc(100% - 16px)');

                $toc_item.css('border-bottom', 'none');
                $toc_list.hide();
            }, 0);
        },

        onLhsPagerClick: function () {
            if (typeof MarkdownReader.my.lhsPageTo === 'function') {
                this.showPage(MarkdownReader.my.lhsPageTo);
            } else {
                this.showPage(function (page, pages, go) {
                    if (jQuery('#pager-lhs').attr('disabled') !== 'disabled') {
                        go.call(this, (page-1 >= 0) ? page-1 : 0, page);
                    }
                });
            }

            jQuery('#content').animate({
                scrollTop: 0
            }, 0);

            var $toc_item = jQuery(jQuery('.md-toc-h3')[this.page]);
            this.scrollTo($toc_item);
            this.highlight($toc_item);

            return false;
        },

        onRhsPagerClick: function () {
            if (typeof MarkdownReader.my.rhsPageTo === 'function') {
                this.showPage(MarkdownReader.my.rhsPageTo);
            } else {
                this.showPage(function (page, pages, go) {
                    if (jQuery('#pager-rhs').attr('disabled') !== 'disabled') {
                        go.call (this, (page+1 < pages) ? page+1 : page, page);
                    }
                });
            }

            jQuery('#content').animate({
                scrollTop: 0
            }, 0);

            var $toc_item = jQuery(jQuery('.md-toc-h3')[this.page]);
            this.scrollTo($toc_item);
            this.highlight($toc_item);

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
                        this.showPage(function (page, pages, go) {
                            var new_page = $content.find('> h3').index($header);
                            go.call(this, new_page, page);
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

        showPage: function (counter) {
            var $items = jQuery('#content > *'),
                $pages = jQuery('#content').find('> h3'),
                $pager = jQuery('#pager');

            var $h2s = this.group($items.not('#pager'), function (item) {
                return item.tagName == 'H2';
            });

            var is_h3 = function (item) {
                return item.tagName == 'H3';
            };

            for (var z = 0; z < $h2s.length; z++) {
                $h2s[z].$h3s = this.group($h2s[z], is_h3);
            }

            var self = this, go = function (new_page, old_page) {
                if ($pager.length > 0 && new_page !== old_page) {
                    $pager.trigger('turn:before', [
                        new_page, old_page, $pages.length
                    ]);
                }

                var min_page = 0;
                jQuery('#pager-lhs').attr('disabled', new_page == min_page);
                var max_page = $pages.length - 1;
                jQuery('#pager-rhs').attr('disabled', new_page == max_page);

                var head = function (h2s) {
                    return jQuery(h2s).first('h2').nextUntil('h3').andSelf();
                };

                var i = 0, j = 0, flag = {};
                for (var page = 0; page < $pages.length; page++) {
                    if ($h2s[i].$h3s[j] === undefined) {
                        i += 1; j = 0;
                    }

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
                    $pager.trigger('turn:after', [
                        new_page, old_page, $pages.length
                    ]);
                }

                if (self.scroll1 !== undefined) {
                    self.scroll1.refresh();
                }

                self.page = new_page;
                return self.page;
            };

            if (typeof counter === 'function') {
                counter.call(this, this.page||0, $pages.length, go);
            } else {
                go(this.page||0, this.page);
            }
        },

        highlight: function ($tocItem) {
            jQuery('.md-toc-item').removeClass('highlight');
            $tocItem.addClass('highlight');
        },

        scrollTo: function ($tocItem) {
            if (this.scroll2 !== undefined) {
                var id = $tocItem.prop('id');
                if (id) {
                    var dt = 600, dx = 0, dy = -3 * $tocItem.height() - 6,
                        fn = IScroll.utils.ease.quadratic;

                    this.scroll2.scrollToElement('#' + id, dt, dx, dy, fn);
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

            return jQuery(groups);
        }
    }
});
