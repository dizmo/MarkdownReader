///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jQuery('#pager').on('turn:before', function (event, new_page, page) {

    if (new_page === 0 && page === undefined) {
        var path = 'settings/framecolor', on_framecolor = function (_, value) {
            jQuery('#overlay').css('background-color', value.slice(0, 7));
        };

        jQuery.get('assets/html/overlay.html', function (data) {
            jQuery('#front').prepend(jQuery(data).on('click', function (ev) {
                jQuery('#overlay').fadeOut('fast');
            }));

            dizmo.subscribeToAttribute(path, on_framecolor);
            on_framecolor(path, dizmo.getAttribute(path));
        });
    }

    console.debug('[on:turn:before]', arguments);
});

jQuery('#pager').on('turn:after', function (event, new_page, page) {

    if (new_page === 0 && page === undefined) {
        dizmo.setAttribute('settings/title', 'Markdown Reader');
    }

    console.debug('[on:turn:after]', arguments);
});

jQuery('#pager').on('turn:after', function (event, new_page, page) {
    setTimeout(function () { jQuery('.md-toc-h2:has(p:empty)').hide(); }, 600);
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * `lhsPageTo` and `rhsPageTo` hooks
 * ---------------------------------
 * Advanced hooks to control the workflow from the current `page` to the new
 * page: invoke the `go` callback with the desired page as the first parameter
 * and the current page as the second parameter.
 *
 * Both parameters are forwarded to the `turn:before` and `turn:after` handlers
 * as `new-page` and as `page`: It is therefore important to set both correctly
 * if the handlers are desired to be used in conjunction with the hooks.
 *
 * The `go` callback returns the `new-page` integer as its result (immediately
 * and independent of the `turn:before` and `turn:after` handler execution).
 */

/*MarkdownReader.my.lhsPageTo = function (page, pages, go) {
    if (jQuery('#pager-lhs').attr('disabled') === 'disabled') {
        return;
    }

    var new_page = go.call(this, (page - 1 >= 0) ? page - 1 : 0, page);
    assert(new_page == page - 1 || new_page == 0);
};*/

/*MarkdownReader.my.rhsPageTo = function (page, pages, go) {
    if (jQuery('#pager-rhs').attr('disabled') === 'disabled') {
        return;
    }

    var new_page = go.call(this, (page + 1 < pages) ? page + 1 : page, page);
    assert(new_page == page + 1 || new_page == page);
};*/

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
