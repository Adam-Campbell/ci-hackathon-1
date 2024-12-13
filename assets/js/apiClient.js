import { getAccessToken } from "./auth.js";


class ApiClient {

    static #instance = null;
    static #requestTimestamps = [];

    constructor() {
        if (ApiClient.#instance) {
            throw new Error("Use ApiClient.getInstance() to get the single instance of this class.");
        }
        this.accessToken = getAccessToken();
    }

    static getInstance() {
        if (!ApiClient.#instance) {
            ApiClient.#instance = new ApiClient();
        }
        return ApiClient.#instance;
    }

    async fetch(url, options = {}) {
        this.reportRequests();
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${this.accessToken}`
            }
        });
        if (response.ok) {
            return response.json();
        }
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    async get(url) {
        return this.fetch(url);
    }

    async post(url, data) {
        return this.fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    /**
     * This method encapsulates the logic for searching for a track, with a maximum number of 
     * pages to search through before giving up.
     * Thus, other parts of the code can call this method to search for a track matching a query, 
     * and speicify the maximum number of pages to search, without having to worry precisely which 
     * page of results the matching track appeared on.
     * @param {*} query 
     * @param {*} maxRequests 
     */
    async searchForTrack(query, maxRequests = 1) {
        // Implement later
        // Return a promise that either resolves to a track object or null.
    }

    reportRequests() {
        const now = Date.now();
        ApiClient.#requestTimestamps.push(now);
        ApiClient.#requestTimestamps = ApiClient.#requestTimestamps.filter(timestamp => timestamp > now - 30000);
        console.log(`${ApiClient.#requestTimestamps.length} API requests made in the last 30 seconds`);
    }
}

export default ApiClient;
