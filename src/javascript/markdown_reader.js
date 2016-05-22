Class("MarkdownReader", {
    my: {
        has: {
            lhsPageTo: {
                is: 'rw', init: function () {
                    return undefined;
                }
            },
            rhsPageTo: {
                is: 'rw', init: function () {
                    return undefined;
                }
            }
        }
    }
});
