import serviceLayer from "./serviceLayer";

/**
 * serviceLayer is an object that exposes methods to interact with the API/auth.
 * 
 * Specifically:
 * 
 * serviceLayer.isLoggedIn() - returns a boolean indicating if the user is logged in.
 * You can call this to determine whether to display the landing page or the app.
 * 
 * 
 * 
 * serviceLayer.beginLoginFlow() - initiates the login flow, redirecting the user to the Spotify login page.
 * You can call this when the user clicks a "Login" button.
 * 
 * 
 * 
 * serviceLayer.createPlaylist(title, message) - creates a playlist with the given title and message (both are strings).
 * The message is used to determine what songs to add to the playlist. Call this method when the user submits the form
 * to create a playlist.
 * This method returns a promise that resolves to the playlist object, so when you call it in your code,
 * you have to do so in a manner that can handle asynchronous code. The easiest way to do this is to use
 * the `await` keyword, like this:
 * 
 * const playlistObject = await serviceLayer.createPlaylist("The title you want to use", "The message you want to use");
 * 
 * By doing so, the variable `playlistObject` will store the playlist object returned by the service layer. The shape of
 * this object can be seen below.
 * 
 * Note that if you use the `await` keyword within a function, then that function must be marked as `async`, like this:
 * 
 * async function handleFormSubmission() { ... }
 * 
 * 
 * Now, the playlist object returned by `serviceLayer.createPlaylist` will have the following shape:
 * 
 * {
 *      name (string, the name of the playlist),
 *      imageUrl (string, the url of the image to use for the playlist),
 *      externalUrl (string, the shareable url to view the playlist on Spotify),
 *      tracks (array of objects, each object representing a track on the playlist)
 * }
 * 
 * Each track object (stored in the tracks array on the playlist object) will have the following shape:
 * {
 *      name (string, the name of the track),
 *      imageUrl (string, the url of the image to use for the track),
 *      artistName (string, the name of the artist),
 *      duration (string, the duration of the track in the format "mm:ss"),
 * }
 * 
 * 
 * 
 * A note for future consideration:
 * For the first sprint we are only implementing the createPlaylist method. For the UI, this means there are
 * no real-time updates to the tracks in the playlist. So you don't need to call the service layer until you
 * have both the title and message from the user, at which point you can call the createPlaylist method.
 * In future sprints, we can break this up so that there is a separate method to get the playlist tracks
 * (as determined by the message), and then you call this method whenever the message changes (this will allow
 * you to update the UI in real time as the user types in the message). But for now, we are keeping it simple.
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */


