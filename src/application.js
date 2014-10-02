//= require Main

function showBack() {
    dizmo.showBack();
}

function showFront() {
    dizmo.showFront();
}

var events = {};
jQuery(document).ready(function () {
    if (MarkdownReader.Dizmo.load('showBack') !== 'True') {
        showBack = undefined;
    }

    if (MarkdownReader.Dizmo.load('showFront') !== 'True') {
        showFront = undefined;
    }

    MAIN = new MarkdownReader.Main();
});
