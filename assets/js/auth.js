/**
 * Initial implementation for accessToken is naive. We save the expiration time as half of the actual expiration time,
 * in order to try and avoid having the token expire mid-way through a user's session. This is not a good solution, but
 * it avoids having to add any retry logic to our API requests for now.
 */
let accessToken = null;


export function initializeLoginState() { 
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessTokenFromUrl = urlParams.get("access_token");
    const expiresIn = urlParams.get("expires_in");
    // If the URL contains an access token,
    if (accessTokenFromUrl && expiresIn) {
        // Then store it in local storage and in-memory.
        const expiresAt = Date.now() + (parseInt(expiresIn) * (1000 / 2));
        localStorage.setItem("accessToken", accessTokenFromUrl);
        localStorage.setItem("expiresAt", expiresAt);
        accessToken = accessTokenFromUrl;
        // And remove the access token from the URL.
        history.replaceState(null, null, " ");
    } else { 
        // If the URL does not contain an access token, check local storage.
        const storedAccessToken = localStorage.getItem("accessToken");
        if (storedAccessToken) {
            // If local storage contains a non-expired access token, store it in-memory.
            const expiresAt = localStorage.getItem("expiresAt");
            if (expiresAt && Date.now() < expiresAt) {
                accessToken = storedAccessToken;
            }
        }
    }

}


/**
 * Returns a boolean indicating whether the user is currently logged in. Currently, this function always returns false.
 * @returns 
 */
export function isLoggedIn() {
    // First we check the in-memory access token.
    if (accessToken) {
        return true;
    }
    // If that is not set, we check local storage.
    const storedAccessToken = localStorage.getItem("accessToken");
    const expiresAt = localStorage.getItem("expiresAt");
    if (storedAccessToken && expiresAt && Date.now() < expiresAt) {
        accessToken = storedAccessToken;
        return true;
    }
    // If the access token is not in-memory or in local storage, we return false.
    return false;
}




/**
 * Initiates the login flow, redirecting the user to the Spotify login page. Currently not fully functional, it just performs basic redirect.
 */
export function beginLoginFlow() {
    // Construct the authorize URL by combining the base URL with all of the necessary query parameters.
    const authorizeURLBase = "https://accounts.spotify.com/authorize";
    const url = new URL(window.location.href);
    url.hash = "";
    const currentUrl = url.href;
    const clientId = "e673f1cb411d40738fc0018486d5da42";
    const scopes = [
        "playlist-modify-public",
        "playlist-modify-private",
    ].join(" ");
    const authorizeURL = `${authorizeURLBase}?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(currentUrl)}&scope=${encodeURIComponent(scopes)}&show_dialog=true`;
    console.log(authorizeURL)
    // Redirect the user to the authorize URL.
    window.location = authorizeURL;
}


export function getAccessToken() {
    return accessToken;
}