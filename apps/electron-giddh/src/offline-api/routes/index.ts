import { getCompaniesRoutes } from "./companies";
import { getCompanyRoutes } from "./company";
import { getBranchesRoutes } from "./branches";

/**
 * Initializing all routes here
 *
 * @param {*} app
 */
export function defineRoutes(app) {
    getCompanyRoutes(app);
    getCompaniesRoutes(app);
    getBranchesRoutes(app);
}