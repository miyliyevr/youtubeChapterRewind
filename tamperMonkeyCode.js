// ==UserScript==
// @name        Yotube next/previous chapter
// @description  Creates hotkey to go to next/previous chapter in the video
// @version      0.8
// @author      rustiX
// @namespace    http://tampermonkey.net/
// @match        http://www.youtube.com/watch?*
// @match        https://www.youtube.com/watch?*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

(function() {
    KeyEvent = (typeof KeyEvent === "object")  ?  KeyEvent  :  [];
    window.addEventListener ("keydown", keyboardHandlerJQ, false);

    let youtubeDescriptionCss = "yt-formatted-string.content a";
    let descTimesRegex = /(\d{1,}:){0,1}\d{1,}:\d\d/;

    function keyboardHandlerJQ (zEvent) {
        var bBlockDefaultAction = false;

        if (zEvent.key == 'n') {
            let nextChapterUrl = DOMRegex(descTimesRegex, youtubeDescriptionCss, 'next');
            window.open(nextChapterUrl,"_self");
            bBlockDefaultAction = true;
        } else if (zEvent.key == 'p') {
            let previousChapterUrl = DOMRegex(descTimesRegex, youtubeDescriptionCss, 'prev');
            window.open(previousChapterUrl,"_self");
            bBlockDefaultAction = true;
        }

        if (bBlockDefaultAction) {
            zEvent.preventDefault ();
            zEvent.stopPropagation ();
        }
    }

    function DOMRegex(regex, cssSelector = '*', direction) {
        let currentTime = document.querySelector("span.ytp-time-current").textContent;
        let currentSeconds = getSeconds(currentTime);
        let prevChapterHref = '';
        let currentChapterHref = '';

        let i = 1;


        for (let i of document.querySelectorAll(cssSelector)) {
            let timeStampText = i.text;

            if (regex.test(timeStampText)) {
                let nextChapterHref = i.href;

                if (getSeconds(timeStampText) > currentSeconds) {
                    if (direction == 'next') {
                        return nextChapterHref;
                    } else if (direction == 'prev' && !(prevChapterHref == '')) {
                        return prevChapterHref;
                    }
                }

                prevChapterHref = currentChapterHref;
                currentChapterHref = i.href;
                i++;
            }
        }
    }

    function getSeconds(timeString) {
        const regex = /(\d{1,}:){0,1}\d{1,}:\d\d/;

        if (regex.test(timeString)) {
            let times = timeString.split(":");
            let seconds = 0;

            if (times.length === 3) {
                seconds = parseInt(times[0])*60*60;
                seconds = seconds + parseInt(times[1])*60;
                seconds = seconds + parseInt(times[2]);
            } else if (times.length === 2) {
                seconds = parseInt(times[0])*60;
                seconds = seconds + parseInt(times[1]);
            } else if (times.length === 1) {
                seconds = parseInt(times[0]);
            }

            return seconds;
        }
    }

})();