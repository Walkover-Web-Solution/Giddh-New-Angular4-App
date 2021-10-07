import { getCompaniesRoutes } from "./companies";
import { getCompanyRoutes } from "./company";
import { getBranchesRoutes } from "./branches";
import { getFinancialYearsRoutes } from "./financial-years";
import { getCommonRoutes } from "./common";
import { getUserRoutes } from "./user";
import { getCmdkRoutes } from "./cmdk";

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
    getUserRoutes(app);
    getCmdkRoutes(app);
}