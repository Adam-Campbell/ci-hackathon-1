/**
 * 
 * ROUGH NOTES - LEAVE HERE FOR NOW
 * 
 * 
 * 
 * We start by discussing what this module needs to do.
 * 
 * From an outside perspective, it takes in:
 *    - A playlist name
 *    - A message
 * It returns:
 *    - A playlist object (technically, a promise that resolves to a playlist object) 
 * 
 * With the 'side effect' that it creates a playlist on the user's Spotify account.
 * 
 * 
 * We take the message, and we try to find songs on spotify that form the message when put together.
 * 
 * Now, there are many ways we can do this. For an initial implementation:
 *  - tokenize the message (each token strictly one word)
 *  - either we find an exact match for a token, or we use single-letter songs to spell out the token.
 *  - what exactly we do with punctuation remains an open question. For things like exclamation marks
 *    we can try to match them, as this will look quite good. For other types of punctuation, we can maybe
 *    ignore them for now. 
 *   - Another question to consider is: if we have to spell out a token, do we try to find some song that can
 *     act as a delimiter to appear before and after the word, for example, a song that is just - or _, or something
 *     similar. This helps distinguish between the words in the message. If we do incorporate this, we should probably
 *     just look up these 'delimiter' songs manually, and hardcode them into the program.
 * 
 *
 * Now, for single letter songs, we can hardcode them. In future, we might include several single-letter songs for
 * each letter and rotate between them, but initially, we will just have one of each. 
 * What we can do: hardcode the track ids, and then look them up as and when needed using the Spotify API (but,
 * once we have looked it up we cache it in-memory so we don't have to look it up again). 
 * 
 * So, what does spelling out a token look like? We need a function that takes in a single token, and returns a list of
 * track objects that spell out the token. 
 * We could create a custom data structure or class for this, call it trackCache. You use it like this:
 * trackCache.get("a");
 * And it returns a promise that resolves to a track object that represents the song "a" - either straight away
 * if the song is already in the cache, or after looking it up if it is not.
 * 
 * Thus, spelling a token (that is, a word), is just a matter of calling trackCache.get for each letter in the word.
 * 
 * So we can define a function, getTracksForToken(token), that returns a promise that resolves to an array of 
 * track objects: specifically, if we find an exact match for the token, then the array will contain just that track,
 * or if we have to fall back to spelling the token, then the array will contain the tracks that spell out the token.
 * All this means is that we have to remember to always spread the result of getTracksForToken when we use it.
 * 
 * This is a good level of abstraction for now. Creating our playlist track structure will involve tokenising the message,
 * then calling getTracksForToken for each token, and then flattening the resulting array of arrays (keeping in mind,
 * this is all going to be asynchronous code).
 * 
 * 
 * 
 * 
 *            As an aside:
 *            Using the custom data structure trackCache allows us to implement more advanced features easily
 *            in future. For example, if we do decide to have multiple single-letter songs for each letter, we can
 *            make trackCache stateful, and have it rotate between the songs for each letter each time it is called
 *            for that letter (the details of exactly how don't matter right now).
 * 
 * 
 * Something else we must consider is what to do with contractions. For example, if the message contains "I'm",
 * do we replace it with the two tokens "I" and "am", or do we try to find a song that represents "I'm" directly?
 * If we do try and find a track matching "I'm" directly, we need to decide what to do with the apostrophe if we
 * end up having to spell the word - do we just ignore the apostrophe, so that "I'm" becomes the tracks "I" and "m"?
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * ______________________________________________________________________________________________________
 * 
 * Find tracks with names 0 through 9 and add them to the trackCache. Also, add common punctuation,
 * particularly the comma, period, exclamation mark, and question mark.
 * 
 * Find something to use a delimiter between words. For now, either hyphen or underscore.
 * 
 * Consider what to do with contractions. Do we search for a match with the contraction in place, or
 * do we ignore it? Do we replace contracted words with their expanded form? If we have to spell out
 * a contraction, do we ignore the apostrophe?
 * 
 * - If the contraction is a pronoun, use the pronoun strategy (consider surrounding tokens).
 * - If the contraction isn't a pronoun, or if the pronoun strategy fails, then just treat
 *   as normal word - try to match with apostrophe in place.
 * - If we have to spell out a contraction, ignore the apostrophe.
 * 
 * Pronouns:
 *  I      you     he     she     it     we     they    
 *  my     your    his    her     its    our    their
 *  me     you     him    her     it     us     them
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */


import ApiClient from "./apiClient.js";


/**
 * Turns a duration in milliseconds into a string of the form "mm:ss"
 * @param {*} milliseconds 
 * @returns 
 */
function formatSongLength(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${paddedSeconds}`;
}


function formatTrack(trackObject) {
    return {
        name: trackObject.name,
        imageUrl: trackObject.album.images[2].url,
        artistName: trackObject.artists[0].name,
        duration: formatSongLength(trackObject.duration_ms),
        id: trackObject.id,
        uri: trackObject.uri
    };
}

const permittedCharacters = "abcdefghijklmnopqrstuvwxyz0123456789!?_";

/**
 * This class is a custom data structure that allows us to look up single-letter songs by letter.
 * Possibly needs a better name.
 */
export class TrackCache {

    static singleLetterTrackIds = {
        "a": "6l0GqFdludHxjHLfFW72dm",
        "b": "3D0sBU4bCHgOFzrE96c0Ie",
        "c": "44Gt1y7WKEgKpJE3YW3qoE",
        "d": "6WrAQb55lcVpkj4jzefQKx",
        "e": "3pOC20Fx1GA27mYfQ7lQGQ",
        "f": "6rtvDzjzbAjGmoSfU4imWV",
        "g": "3hpB5SlyESKXrmc6NUNQhd",
        "h": "45wkxZaO7GmBh7rhc98eLv",
        "i": "3ODXRUPL44f04cCacwiCLC",
        "j": "2QuKpAI5kmgdwCbApdB4wT",
        "k": "60PYeUQfqh1FYuDBlsV9or",
        "l": "6brTu7TkwXtFMjQgcxkMA4",
        "m": "53sk4XbQHveSGDXq0k8asW",
        "n": "6DwF5IUONr6L0aSmxYyT0V",
        "o": "77yuzxCS3csrgTPSW0pvyk",
        "p": "07BSS3iMuvLXUHQZdGkfU5",
        "q": "2MGhnwWH6ppXhsxfFQLOzl",
        "r": "1cJeF9BrCougCL3XkCsm70",
        "s": "336eHf6SexQkX3MZDykFC7",
        "t": "4db54JOdAm7OnDqjpWy1uj",
        "u": "1bxEpNR75Hq3T2oF9AZjt8",
        "v": "7BaQc1OYz1gMedTlMRRhkT",
        "w": "2BWQIsuarfRoeqmnPvRO97",
        "x": "1wODklZOdPg66i7RsyMptS",
        "y": "2nfYd5u63QE2bhlYX4UvDH",
        "z": "37zezNOHfSJu088cJNbdtY",
        "0": "5DQQHyVVRQbrjwyt43aFhj",
        "1": "6D2RrUwborgyTLm63zvwZl",
        "2": "0rmiPGYCyddPq6J52y2CtN",
        "3": "7EJVqS0DDYf2Uy5z4Jyo8G",
        "4": "55p1Ghm6S69PHd7mztbXgb",
        "5": "6hyvdte2QylV9yOJ0erH94",
        "6": "7nkHTLoRFYbAF6PI4TUI6v",
        "7": "5ykbOijJEfRhuo2Td1m0Qd",
        "8": "4aZMCxWGgfCb0B9DJQTLGI",
        "9": "1C7KSXR2GVxknex6I4ANco",
        "!": "1A05ibu1DXGIt0F62NG7xU", // 6vSui5MRtBGmOP3RL8D3M5 is !!!
        "?": "349xMh3pHoSafOloonyQo0",
        "delimeter": "0NjGohOFKKxpJLLAovsEtO",  // gives the string "______"
        "_": "0NjGohOFKKxpJLLAovsEtO",         // above one left for clarity, but this is the one we use
        "i'm": "1Z748upUJ4SxR1QGcnQKoj",    // don't know if I'll use any of these yet
        "you're": "6owC3XvZFPkaDfMiOQPi22",
        "it's": "2k7ILhNw7jB73x0ireS5kY",
        "don't": "1huvTbEYtgltjQRXzrNKGi",
        "can't": "42RzJ3eJARwTlUVVYdZQ10",
        "won't": "6AgN8BrRPwYj2EH1QziDVN",
        "i've": "10BaF5gesuqCCMOcDvo2oK",
        "we'll": "0S7KFXKqYPA3XHXUyS5JPe",
        "we're": "09kcWdIxuFW8NPuuPPlcoq",
        "ain't": "6v10Cb6sQksPw4pIs3ksGr",
        "you're": "6owC3XvZFPkaDfMiOQPi22",
        "i'd": "2yKHZIJULt0scfXh8nLDoN",
        "he'll": "4FWgzYxQBYYiIwJmwHdIZG", // gives "he will"
        "she'll": "1XZ4HVZiEIjhbOS4QGp1sH",
        "they'll": "4zA4JIlPXfmvDa7mOnvaxa", // gives "they will"
        "there's": "2H4CfAE5aM11KtLWsds0Fd",
        "i'll": "27sKtH0PZpASkN8H3ZJOQf", // gives "I will"
        "you'll": "0yRK8LQs9BJXGjv8ffaGUh",  // gives "you will"
        "let's": "2y8QLwQome3hDk8QqTWC7X"
    };
    static #instance = null;

    constructor() {
        if (TrackCache.#instance) {
            throw new Error("Use TrackCache.getInstance() to get the single instance of this class.");
        }
        this.cache = new Map();
        this.apiClient = ApiClient.getInstance();
    }

    static getInstance() {
        if (!TrackCache.#instance) {
            TrackCache.#instance = new TrackCache();
        }
        return TrackCache.#instance;
    }

    async get(letter) {
        letter = letter.toLowerCase();
        if (this.cache.has(letter)) {
            return this.cache.get(letter);
        } else {
            const track = await this.lookupTrack(letter);
            this.cache.set(letter, track);
            return track;
        }
    }

    async lookupTrack(letter) {
        const trackId = TrackCache.singleLetterTrackIds[letter];
        const data = await this.apiClient.get(`https://api.spotify.com/v1/tracks/${trackId}`);
        return formatTrack(data);
    }
}


/**
 * Gets the tracks that represent a single token (one word). Returns a promise that resolves 
 * to an array of track objects - a single track object if we find an exact match for the token,
 * or multiple track objects if we have to spell out the token.
 * @param {*} token 
 * @returns 
 */
export async function getTracksForToken(token) {
    token = token.toLowerCase();
    // First, we try to match the whole token
    const apiClient = ApiClient.getInstance();
    const data = await apiClient.get(`https://api.spotify.com/v1/search?q=${token}&type=track&limit=50`);
    for (const track of data.tracks.items) {
        if (track.name.toLowerCase() === token) {
            const formattedTrack = formatTrack(track);
            return [formattedTrack];
        }
    }
    // If we can't match the whole token, we spell it out instead.
    // The requests run in parallel.
    // But first, we pad the token with the delimiter track on either side
    //token = `_${token}_`;
    const trackCache = TrackCache.getInstance();
    // We pad the word with delimiters, filter out any characters not in permittedCharacters,
    // and then map each character to a promise that resolves to a track object.
    const characterPromises = `_${token}_`
        .split("")
        .filter(letter => permittedCharacters.includes(letter))
        .map(letter => trackCache.get(letter));
    //const tracks = await Promise.all(charArray.map(letter => trackCache.get(letter)));
    // We await the promises and return the result.
    const tracks = await Promise.all(characterPromises);
    return tracks;
}


/**
 * Constructs a playlist based on message (but does not post the playlist to Spotify).
 * Outputs a promise that resolves to an array of track objects.
 * @param {*} message 
 * @returns 
 */
export async function constructPlaylistTracks(message) {
    // Tokenise the message
    let tokens = message.split(" ");
    // For each token, pass it to getTracksForToken.
    // The requests run in parallel.
    const results = await Promise.all(tokens.map(token => getTracksForToken(token)));
    // The result will be an array of arrays, so we must flatten it. 
    return results.flat();
}


export async function createPlaylist(playlistName, message) {
    // Construct the tracks for the playlist (we do this first so that if anything goes wrong
    // and we can't find tracks for the message, we don't create an empty playlist).
    const tracks = await constructPlaylistTracks(message);

    // Assuming tracks are constructed successfully, we then create the playlist.
    // We need to get the user's ID first. For now, just call the /me endpoint here.
    // In future, we will probably call this on app startup and store users profile information.
    // Now, once the playlist is created, we get a response that includes the playlist ID.
    const apiClient = ApiClient.getInstance();
    const user = await apiClient.get("https://api.spotify.com/v1/me");
    const userId = user.id;
    const emptyPlaylist = await apiClient.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        name: playlistName
    });
    const playlistId = emptyPlaylist.id;

    // We then add the tracks to the playlist. We need to call the /playlists/{playlist_id}/tracks endpoint.
    // We can add up to 100 tracks at a time, so we need to batch the tracks into groups of 100. For the 
    // initial implementation we will just assume that there aren't more than 100 tracks in the playlist, 
    // but in future we should add batching.
    const trackUris = tracks.map(track => track.uri);
    const addTrackResponse = await apiClient.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        uris: trackUris
    });


    // If we get around to implementing playlist image generation, then we would also call the 
    // /playlists/{playlist_id}/images endpoint here (it is a PUT request).


    // Finally, we return the playlist object.
    const playlistObject = {
        name: playlistName,
        id: playlistId,
        imageUrl: tracks[0].imageUrl, // just a placeholder, we can implement playlist image generation later
        externalUrl: emptyPlaylist.external_urls.spotify,
        tracks: tracks
    };
    console.log(playlistObject);
    return playlistObject;
    
}



