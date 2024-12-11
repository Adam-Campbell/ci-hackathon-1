
function isLoggedIn() {
    return false;
}

function beginLoginFlow() {
    const authorizeURLBase = "https://accounts.spotify.com/authorize";
    window.location = authorizeURLBase;
}

async function createPlaylist(title, message) {
    return {};
}


export default {
    isLoggedIn,
    beginLoginFlow,
    createPlaylist
};









