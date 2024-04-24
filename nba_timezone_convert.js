// ==UserScript==
// @name         Convert NBA Time ET to GMT
// @namespace     http://tampermonkey.net/
// @version      0.1
// @description  Adjust NBA game times from ET to GMT on NBA.com
// @author       Sverrir Bjorgvinsson
// @match        *://*nba.com/*
// @match        *://*.nba.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert time from ET to GMT
    function convertTimeToGMT() {
        // Selects elements by class name that match the starting pattern ScoreStripGame_gameBroadcastInfo
        document.querySelectorAll('[class^="ScoreStripGame_gameBroadcastInfo__"]').forEach(container => {
            const timeElements = container.querySelectorAll('p'); // Assume time is within a <p> tag in these containers
            timeElements.forEach(element => {
                let timeText = element.textContent.trim(); // e.g., "7:30 pm ET"
                let match = timeText.match(/(\d+):(\d+)\s*(am|pm)\s*ET/);
                if (match) {
                    let hours = parseInt(match[1], 10);
                    let minutes = match[2];
                    let ampm = match[3];

                    // Convert to 24-hour time for easier manipulation
                    if (ampm === 'pm' && hours < 12) {
                        hours += 12;
                    }

                    // Adjust for GMT (5 hours ahead of ET)
                    hours += 4;

                    // Convert back to 12-hour format and adjust AM/PM if necessary
                    if (hours >= 24) {
                        hours -= 24;
                    }
                    ampm = hours >= 12 ? 'pm' : 'am';
                    if (hours > 12) {
                        hours -= 12;
                    }
                    if (hours === 0) {
                        hours = 12; // Handle midnight case
                    }

                    // Update the element's text content to show GMT
                    element.textContent = `${hours}:${minutes} ${ampm} GMT`;
                }
            });
        });
    }

    // Run the conversion function when the document loads and periodically to catch dynamic updates
    window.addEventListener('load', convertTimeToGMT);
    setInterval(convertTimeToGMT, 10); // Update every 5 seconds to catch dynamic changes
})();
