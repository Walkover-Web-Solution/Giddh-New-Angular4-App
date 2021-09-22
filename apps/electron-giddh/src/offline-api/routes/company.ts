import { getCompanyController } from "../controllers/company";

/**
 * Company routes
 *
 * @param {*} app
 */
export function getCompanyRoutes(app) {
    app.get('/company/:companyUniqueName', getCompanyController);
}