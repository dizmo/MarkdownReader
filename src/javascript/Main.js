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
            console.debug ('ON:KEYUP', arguments); //TODO: Fetch MD via URL!
        },

        onTurn: function (dizmo, side) {
            if (side === 'front') {
                jQuery('#front').empty().append(
                    this.md2html.makeHtml (EDITOR.getValue ()));
            }
        }
    }
});
