//= require Dizmo

Class("MarkdownReader.Main", {
    has: {
        md2html: {
            is: 'ro', init: function () {
                return MD2HTML = Markdown.getSanitizingConverter({
                    nonAsciiLetters: true
                });
            }
        },
        mdValue: {
            is: 'rw', init: function () {
                return undefined;
            }
        },
        cssValue: {
            is: 'rw', init: function () {
                return undefined;
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
                this.onShowFront.call (this);
            } else {
                this.onShowBack.call (this);
            }
        },

        onShowFront: function () {
            var self = this;
            var url = jQuery('#url').val();
            if (url && url.length > 0 && url.match(/\.md$/)) {
                jQuery.ajax({type: 'GET', url: url, success: function (value) {
                    self.cssValue = EDITOR.getValue ();
                    jQuery('style#css').remove(); jQuery('head').append (
                        '<style id="css">' + self.cssValue + '</style>');

                    self.mdValue = value;
                    jQuery('#front').empty().append (
                        self.md2html.makeHtml(self.mdValue));
                }});
            }
        },

        onShowBack: function () {
        }
    }
});
