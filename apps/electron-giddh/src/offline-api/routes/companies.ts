import { getCompaniesController } from "../controllers/companies";

/**
 * Companies routes
 *
 * @param {*} app
 */
export function getCompaniesRoutes(app) {
    app.get('/users/:userUniqueName/v2/companies', getCompaniesController);
}