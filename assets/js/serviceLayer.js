let accessToken = null;


/**
 * Returns a boolean indicating whether the user is currently logged in. Currently, this function always returns false.
 * @returns 
 */
function isLoggedIn() {
    // Check local storage for access token. If it exists and has not expired, then
    // retrieve access token and store in module-level accessToken variable. Then return true.

    // If access token does not exist or has expired, check whether the URL contains an access token.
    // If it does, store the access token in local storage, store it in the module-level accessToken variable,
    // and return true.

    // If none of the above conditions are met, return false.
    return false;
}


function storeToken() {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get("access_token");
    const expiresIn = urlParams.get("expires_in");
    if (accessToken && expiresIn) {
        const expiresAt = Date.now() + (parseInt(expiresIn) * (1000 / 2));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("expiresAt", expiresAt);
        history.replaceState(null, null, " ");
    }
}





/**
 * Initiates the login flow, redirecting the user to the Spotify login page. Currently not fully functional, it just performs basic redirect.
 */
function beginLoginFlow() {
    // Construct the authorize URL by combining the base URL with all of the necessary query parameters.
    const authorizeURLBase = "https://accounts.spotify.com/authorize";


    // Redirect the user to the authorize URL.
    window.location = authorizeURLBase;
}


/**
 * Creates playlist based on title and message. Currently, this function just returns a mock object.
 * @param {*} title 
 * @param {*} message 
 * @returns 
 */
async function createPlaylist(title, message) {
    const mockData = {
        name: "Stop borrowing my stuff without asking me first!",
        imageUrl: "https://via.placeholder.com/150",
        externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
        tracks: [
            {
                name: "Stop",
                imageUrl: "https://i.scdn.co/image/ab67616d00001e02f660420bcef3b16b4c7e5f2b",
                artistName: "Spice Girls",
                duration: "03:45"
            },
            {
                name: "Borrowing",
                imageUrl: "https://i.scdn.co/image/ab67616d00001e02c186b21c4e63b191dde67a84",
                artistName: "Tom Rosenthal",
                duration: "04:15"
            },
            {
                name: "My",
                imageUrl: "https://i.scdn.co/image/ab67616d00001e02460e1fb98650329b72a297cc",
                artistName: "Wordsworth Whittier",
                duration: "02:30"
            },
            {
                name: "Stuff",
                imageUrl: "https://i.scdn.co/image/ab67616d00001e02e1482c0ad6edd7335da7c520",
                artistName: "LOAD",
                duration: "02:45"
            },
            {
                name: "Without",
                imageUrl: "https://i.scdn.co/image/ab67616d00001e027f073a643f427db13ea969bf",
                artistName: "A. G. Cook",
                duration: "03:16"
            },
            {
                name: "Asking",
                imageUrl: "https://i.scdn.co/image/ab67616d00001e0237fcf9263b02552e96198128",
                artistName: "Sonny Fodera",
                duration: "04:49"
            },
            {
                name: "Me first",
                imageUrl: "https://i.scdn.co/image/ab67616d00001e02e984a36983bee3a25399c7c5",
                artistName: "Emily Faye",
                duration: "03:36"
            },
            {
                name: "!",
                imageUrl: "https://i.scdn.co/image/ab67616d00001e027bf10ec5f8cdd4a9f5ab86e5",
                artistName: "Samey",
                duration: "02:59"
            },
        ]
    };
    console.log(`
        You called createPlaylist with the following arguments:
            title: ${title}
            message: ${message}
        
        The mock object returned by this function is also logged below so that you can inspect it.
    `);
    console.log(mockData);
    return mockData;
}


export default {
    isLoggedIn,
    beginLoginFlow,
    createPlaylist
};









