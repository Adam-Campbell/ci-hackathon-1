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

    reportRequests() {
        const now = Date.now();
        ApiClient.#requestTimestamps.push(now);
        ApiClient.#requestTimestamps = ApiClient.#requestTimestamps.filter(timestamp => timestamp > now - 30000);
        console.log(`${ApiClient.#requestTimestamps.length} API requests made in the last 30 seconds`);
    }
}

export default ApiClient;
