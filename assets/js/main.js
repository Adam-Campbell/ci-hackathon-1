console.log("Hello, from main.js");

/**
 * 
 * Get basic skeleton in place to ensure everything works
 * 
 * Login:
 * - User initiates
 * - Redirects to Spotify login page
 * - User logs in there
 * - Redirects back to app, with token in URL
 * - We grab token from URL
 * 
 * Basic endpoint interaction:
 * - GET user profile info
 * - GET search results for song
 * - POST create playlist
 * - POST add song to playlist
 * 
 * 
 * 
 */




function authorize() {
    const authorizeURLBase = "https://accounts.spotify.com/authorize"
    const redirectURI = "http://127.0.0.1:5500/index.html"
    const clientId = "e673f1cb411d40738fc0018486d5da42";
    const scopes = [
        "playlist-modify-public",
        "playlist-modify-private",
    ].join(" ");
    const authorizeURL = `${authorizeURLBase}?client_id=${clientId}&response_type=token&redirect_uri=${redirectURI}&scope=${encodeURIComponent(scopes)}&show_dialog=true`;
    window.location = authorizeURL;
}





function getAccessToken() {
    const url = window.location.href;
    const accessToken = url.match(/access_token=([^&]*)/);
    if (accessToken) {
        return accessToken[1];
    }
    return null;
}




document.getElementById("login-button").addEventListener("click", authorize);
const searchForm = document.getElementById("search-form");
let accessToken = getAccessToken();
let currentUser = null;
const apiBase = "https://api.spotify.com/v1";
const testURI1 = "spotify:track:6AI3ezQ4o3HUoP6Dhudph3";
const testURI2 = "spotify:track:1H1YEMVYQiQCf6txxbHV39"



function getSearchResults(query) {
    const encodedQuery = encodeURIComponent(query);
    const searchURL = `${apiBase}/search?q=${encodedQuery}&type=track&limit=50`;
    fetch(searchURL, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const searchResults = data.tracks.items;
        console.log(searchResults);
        //displaySearchResults(searchResults);
    })
    .catch(error => console.error(error));
}

searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const query = searchForm.query.value;
    getSearchResults(query);
});


function getCurrentUser() {
    const userURL = `${apiBase}/me`;
    fetch(userURL, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const user = data;
        //displayUser(user);
        currentUser = user;
    });
}

if (accessToken) {
    getCurrentUser();
}


function createPlaylist(name) {
    const createPlaylistURL = `${apiBase}/users/${currentUser.id}/playlists`;
    fetch(createPlaylistURL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            name: name
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const playlistId = data.id;
        const addToPlaylistURL = `${apiBase}/playlists/${playlistId}/tracks`;
        fetch(addToPlaylistURL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                uris: [testURI1, testURI2]
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
    });
}

document.getElementById("create-playlist-button").addEventListener("click", () => {
    createPlaylist(`SPTP Playlist ${Date.now()}`);
});
