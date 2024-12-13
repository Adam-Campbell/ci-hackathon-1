import { beginLoginFlow, initializeLoginState, isLoggedIn } from "./auth.js";
import { createPlaylist } from "./playlistCreation.js";

//document.getElementById("login-button").addEventListener("click", beginLoginFlow);

// Just for debugging, delete this line later.
window.isLoggedIn = isLoggedIn;


initializeLoginState();

window.createPlaylist = createPlaylist;

export default {
    initializeLoginState,
    isLoggedIn,
    beginLoginFlow,
    createPlaylist
};









