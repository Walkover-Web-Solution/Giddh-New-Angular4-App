/**
 * This will return api url based on env received
 *
 * @param {*} request
 * @returns
 */
export function getApiUrl(request) {
    switch (request.query.env) {
        case "test":
            return "https://apitest.giddh.com/";
        case "stage":
            return "https://apirelease.giddh.com/";
        case "prod":
            return "https://api.giddh.com/";
        default:
            return "https://api.giddh.com/";
    }
}