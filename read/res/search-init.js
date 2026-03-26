document.addEventListener("DOMContentLoaded", function () {

    loadGlossaryJSON();

    // PREPARE POPUP FOR INITATING SEARCH

    let popup = document.createElement("div");
    popup.className = "popup";
    popup.style.opacity = "0";
    document.body.appendChild(popup);
    
    const searchicon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

    document.body.addEventListener("click", function (event) {
        let span = event.target.closest("span[data-root]");
        if (span) {
            let dataRoot = span.getAttribute("data-root");

	    unhighlightMatches();

            // Create popup content
            let dataRoots = dataRoot.split(',');
            let linksHTML = 'Roots:';
            dataRoots.forEach(root => {
                const trimmedRoot = root.trim();
                const trimmedRootEncoded = encodeURIComponent(trimmedRoot);
		let gloss = trimmedRoot;

		const result = findGloss(trimmedRoot);
		if (result) {
		    gloss = result.glossHeb + " / " + result.glossXlit;
		}
		
                linksHTML += `<br /><a href="glossary.html#x${trimmedRootEncoded}" target="_blank" title="Glossary for ${result.glossHeb}">${gloss}</a>
			<a href="search.html?q=${trimmedRootEncoded}" target="_blank" title="Search ${result.glossHeb}">${searchicon}</a>`;
		
		highlightMatches(trimmedRoot)
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

    highlightMatches(searchQuery);

    console.log("Matches highlighted.");

});

let glossaryData = null;
async function loadGlossaryJSON() {
    console.log("Loading glossary JSON...");
    try {
        const response = await fetch('glossary.json');
        if (!response.ok) {
            throw new Error('Failed to load glossary.json');
        }

        glossaryData = await response.json();
        console.log('Glossary loaded');

    } catch (error) {
        console.error(error);
    }
}

function findGloss(strongsNumber) {
    if (!glossaryData) {
        console.log('Glossary not loaded yet');
        return null;
    }

    const entry = glossaryData["x" + strongsNumber];

    if (!entry) {
        return null;
    }

    return {
        glossHeb: entry.gloss_heb,
        glossXlit: entry.gloss_xlit
    };
}

function highlightMatches(searchQuery) {
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
        console.warn(`No spans matching ${searchQuery} found.`);
        return;
    }

    matchingSpans.forEach(span => {
        span.classList.add("match"); // Highlight the matching span
    });
}

function unhighlightMatches(searchQuery) {
    let allSpans = document.getElementById("translation").querySelectorAll("span[data-root]");

    allSpans.forEach(span => {
	span.classList.remove("match"); // Remove all highlights
    });
}