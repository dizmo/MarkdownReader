//= require Main

function showBack() {
    dizmo.showBack();
}

function showFront() {
    dizmo.showFront();
}

var events = {};
jQuery(document).ready(function () {
    if (MarkdownReader.Dizmo.load('showBack') !== true) {
        showBack = undefined;
    }

    if (MarkdownReader.Dizmo.load('showFront') !== true) {
        showFront = undefined;
    }

    MAIN = new MarkdownReader.Main();
});
