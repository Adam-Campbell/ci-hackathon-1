/**
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
 * We could create a custom data structure for this, call it trackCache. You use it like this:
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
 * 
 * 
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

// Eventually, we will probably have a fetch abstraction that handles things like getting the accessToken to
// make the request. For now, we'll just retrieve the access token directly.
import { getAccessToken } from "./auth.js";


function formatSongLength(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${paddedSeconds}`;
}




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
        "z": "37zezNOHfSJu088cJNbdtY" 
    };

    constructor() {
        this.cache = new Map();
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
        console.log(`Looking up track for letter ${letter}`);
        const trackId = TrackCache.singleLetterTrackIds[letter];
        const accessToken = getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        return {
            name: data.name,
            imageUrl: data.album.images[2].url,
            artistName: data.artists[0].name,
            duration: formatSongLength(data.duration_ms),
            id: data.id
        };
    }
}


/**
 * name           data.name
 * imageUrl       data.album.images[2].url         (the 3rd image is a good size for our purposes)
 * artistName     data.artists[0].name
 * duration       formatSongLength(data.duration_ms)
 * id             data.id
 * 
 * 
 * 
 * 
 */











