function toSentenceCase(text) {
    if (!text) return text;
    return text.toLowerCase().replace(/(^|[.!?]\s*)([a-z])/g, function(match, sep, letter) {
        return sep + letter.toUpperCase();
    });
}

function applySentenceCase() {
    var selectors = [
        'yt-formatted-string.style-scope.ytd-watch-metadata',
        'yt-formatted-string.style-scope.ytd-rich-grid-media',
        'span.style-scope.ytd-compact-video-renderer',
        'span.style-scope.ytd-rich-grid-slim-media',
        'span.style-scope.ytd-reel-item-renderer',
        '.ytp-title-link.yt-uix-sessionlink.ytp-title-fullerscreen-link',
        '.miniplayer-title.style-scope.ytd-miniplayer',
        '#video-title',
        'ytd-video-renderer #video-title',
        'ytd-grid-video-renderer #video-title',
        'ytd-rich-item-renderer #video-title',
        'ytd-compact-video-renderer #video-title',
        '.yt-core-attributed-string'
    ].join(',');

    var elements = document.querySelectorAll(selectors);
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        if (!el.dataset.tmcOriginal) {
            el.dataset.tmcOriginal = el.textContent;
        }
        var newText = toSentenceCase(el.dataset.tmcOriginal);
        if (el.textContent !== newText) {
            el.textContent = newText;
        }
    }
}

function injectCSS(item) {
    var ytbTextTransformStyle = item.ytbTextTransformStyle || "lowercase";

    if (ytbTextTransformStyle === "sentence") {
        applySentenceCase();
        setInterval(applySentenceCase, 1500);
        return;
    }

    var css = `
        yt-formatted-string.style-scope.ytd-watch-metadata,
        yt-formatted-string.style-scope.ytd-rich-grid-media,
        span.style-scope.ytd-compact-video-renderer,
        span.style-scope.ytd-rich-grid-slim-media,
        span.style-scope.ytd-reel-item-renderer,
        .ytp-title-link.yt-uix-sessionlink.ytp-title-fullerscreen-link,
        .miniplayer-title.style-scope.ytd-miniplayer,
        #video-title,
        ytd-video-renderer #video-title,
        ytd-grid-video-renderer #video-title,
        ytd-rich-item-renderer #video-title,
        ytd-compact-video-renderer #video-title,
        .yt-core-attributed-string {
            text-transform: ${ytbTextTransformStyle} !important;
        }
    `;

    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(style);
}

function onError(error) {
    console.error(`Error in injecting CSS: ${error}`);
}

document.addEventListener('DOMContentLoaded', function () {
    var getting = browser.storage.sync.get("ytbTextTransformStyle");
    getting.then(injectCSS, onError);
});
