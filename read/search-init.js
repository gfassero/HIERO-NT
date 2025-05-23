document.addEventListener("DOMContentLoaded", function () {

    // PREPARE POPUP FOR INITATING SEARCH

    let popup = document.createElement("div");
    popup.className = "popup";
    popup.style.opacity = "0";
    document.body.appendChild(popup);

    document.body.addEventListener("click", function (event) {
        let span = event.target.closest("span[data-root]");
        if (span) {
            let dataRoot = span.getAttribute("data-root");

            // Create popup content
            let dataRoots = dataRoot.split(',');
            let linksHTML = 'Search roots:';
            dataRoots.forEach(root => {
                const trimmedRoot = root.trim();
                linksHTML += ` <a href="search.html?q=${trimmedRoot}" target="_blank">${trimmedRoot}</a>`;
            });
            popup.innerHTML = linksHTML;

            // Position popup near clicked word
            if (popup.style.opacity === "0") {
                popup.style.transition = "0s";
            } else {
                popup.style.transition = "0.15s";
            }
            popup.style.left = `${event.pageX - popup.offsetWidth / 2}px`;
            popup.style.top = `${event.pageY - 3}px`;

            // Trigger a redraw (force layout recalculation)
            void popup.offsetWidth;

            popup.style.transition = "0.15s";
            popup.style.opacity = "1";
            popup.style.pointerEvents = "auto";

        } else {
            // Hide popup if clicking elsewhere
            popup.style.opacity = "0";
            popup.style.pointerEvents = "none";
        }
    });



    // HIGHLIGHT MATCHES WHEN RETURNING FROM SEARCH

    let searchQuery = new URLSearchParams(window.location.search).get("q"); // Get search term from URL
    console.log("Search query:", searchQuery);

    if (!searchQuery) {
        console.warn("No search query provided.");
        return;
    }

//    let matchingSpans = document.getElementById("translation").querySelectorAll(`span[data-root='${searchQuery}']`); // Select from the current document
let allSpans = document.getElementById("translation").querySelectorAll("span[data-root]");
    let matchingSpans = [];

    allSpans.forEach(span => {
        let dataRoots = span.getAttribute("data-root").split(',');
        if (dataRoots.includes(searchQuery)) {
            matchingSpans.push(span);
        }
    });
    console.log("Matching spans found:", matchingSpans.length);

    if (matchingSpans.length === 0) {
        console.warn("No matching spans found.");
        return;
    }

    matchingSpans.forEach(span => {
        span.classList.add("match"); // Highlight the matching span
    });

    console.log("Matches highlighted.");

});
