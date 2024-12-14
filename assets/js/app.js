import serviceLayer from "./serviceLayer.js";


/**
 * 
 * NOTES
 * 
 * Spotify playlist images should be 300x300.
 * If we implement playlist images, all images we used should be cropped and resized to 300x300.
 * 
 * 
 * 
 * 
 */







// First, initialize the login state and check whether the user is logged in.
serviceLayer.initializeLoginState();
const isLoggedIn = serviceLayer.isLoggedIn();
// Grab wrapper elements
const landingPageWrapper = document.getElementById("landing-page-wrapper");
const appWrapper = document.getElementById("app-wrapper");

if (isLoggedIn) {
    landingPageWrapper.classList.add("hide");
    appWrapper.classList.remove("hide");
    console.log("User is logged in");
    const createPlaylistFormContainer = document.getElementById("create-playlist-form-container");
    const playlistSharerContainer = document.getElementById("playlist-sharer-container");
    const playlistDisplayContainer = document.getElementById("playlist-display-container");
    const playlistTracksContainer = document.getElementById("playlist-tracks-container");
    const createPlaylistForm = document.getElementById("create-playlist-form");
    const copyButton = document.getElementById("copy-button");
    const sharerLink = document.getElementById("sharer-link");
    const resetButton = document.getElementById("reset-button");
    let playlistObject = null;

    createPlaylistForm.addEventListener("submit", handleFormSubmit);
    copyButton.addEventListener("click", handleCopyButtonClick);
    resetButton.addEventListener("click", resetView);
    
    function createTrackListItem(track) {
        const li = document.createElement('li');
        li.classList.add("track");
        li.innerHTML = `
            <img src="${track.imageUrl}" class="track-image" alt="${track.name}">
            <div class="track-details">
                <span class="track-name">${track.name}</span>
                <span>${track.artistName}</span>
            </div>
            <span class="track-duration">${track.duration}</span>
        `;
        return li;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        // Get the playlist title and message from the form.
        const playlistTitle = e.target.playlistTitle.value;
        const playlistMessage = e.target.playlistMessage.value;
        // Clear the form.
        e.target.reset();
        const startTime = performance.now();
        // Call serviceLayer.createPlaylist with the title and message, await the result.
        playlistObject = await serviceLayer.createPlaylist(playlistTitle, playlistMessage);
        // Iterate over the tracks in the playlist object and render them to the DOM, using createTrackListItem.
        for (const track of playlistObject.tracks) {
            const trackListItem = createTrackListItem(track);
            playlistTracksContainer.appendChild(trackListItem);
        }
        // Add name
        document.getElementById("playlist-name").textContent = playlistObject.name;
        // Populate the sharer
        populateSharer(playlistObject.externalUrl);
        const endTime = performance.now();
        console.log(`Playlist creation took ${(endTime - startTime) / 1000} seconds.`);
        // Show and hide the appropriate containers.
        createPlaylistFormContainer.classList.add("hide");
        playlistSharerContainer.classList.remove("hide");
        playlistDisplayContainer.classList.remove("hide");
    }

    function resetView() {
        createPlaylistFormContainer.classList.remove("hide");
        playlistSharerContainer.classList.add("hide");
        playlistDisplayContainer.classList.add("hide");
        playlistTracksContainer.innerHTML = "";
    }

    function populateSharer(url) {
        const sharerLink = document.getElementById("sharer-link");
        sharerLink.textContent = url;
        sharerLink.href = url;
    }

    function handleCopyButtonClick() {
        const url = sharerLink.textContent;
        navigator.clipboard.writeText(url);
    }


} else {
    
    const heroLoginButton = document.getElementById("hero-login");
    const footerLoginButton = document.getElementById("footer-login");
    heroLoginButton.addEventListener("click", serviceLayer.beginLoginFlow);
    footerLoginButton.addEventListener("click", serviceLayer.beginLoginFlow);
}









