import { getCompaniesRoutes } from "./companies";
import { getCompanyRoutes } from "./company";
import { getBranchesRoutes } from "./branches";
import { getFinancialYearsRoutes } from "./financial-years";
import { getCommonRoutes } from "./common";

/**
 * Initializing all routes here
 *
 * @param {*} app
 */
export function defineRoutes(app) {
    getCompanyRoutes(app);
    getCompaniesRoutes(app);
    getBranchesRoutes(app);
    getFinancialYearsRoutes(app);
    getCommonRoutes(app);
}