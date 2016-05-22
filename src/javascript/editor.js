Class("MarkdownReader.Editor", {

    my: {
        has: {
            text: {
                is: 'ro', init: function () {
                    return [
                        '/**\n',
                        ' * Extra CSS: front, content, headers etc.\n',
                        ' */\n',
                        '\n',
                        '#front {\n',
                        '  /* front side styles */\n',
                        '}\n',
                        '\n',
                        '#content {\n',
                        '  /* content styles (on front side) */\n',
                        '}\n'
                    ].join ('');
                }
            }
        }
    },

    has: {
        ta: {
            is: 'ro', init: function () {
                return document.getElementById('editor');
            }
        },
        editor: {
            is: 'rw', init: function () {
                return undefined;
            }
        }
    },

    after: {
        initialize: function () {
            if (typeof CodeMirror !== 'undefined') {
                this.editor = CodeMirror.fromTextArea(this.ta, {
                    lineNumbers: true,
                    lineWrapping: true,
                    matchBrackets: true,
                    mode: 'css',
                    styleActiveLine: true
                });
            }

            this.setValue (this.my.text);
        }
    },

    methods: {
        getValue: function () {
            if (this.editor !== undefined) {
                return this.editor.getValue();
            } else {
                return this.ta.value;
            }
        },
        setValue: function (value) {
            if (this.editor) {
                this.editor.setValue(value);
            } else {
                this.ta.value = value;
            }
        },
        refresh: function () {
            if (this.editor !== undefined) {
                this.editor.refresh();
            }
        }
    }
});
