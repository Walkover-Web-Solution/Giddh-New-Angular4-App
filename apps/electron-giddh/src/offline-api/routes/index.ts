import { getCompaniesRoutes } from "./companies";
import { getCompanyRoutes } from "./company";

/**
 * Initializing all routes here
 *
 * @param {*} app
 */
export function defineRoutes(app) {
    getCompanyRoutes(app);
    getCompaniesRoutes(app);
}