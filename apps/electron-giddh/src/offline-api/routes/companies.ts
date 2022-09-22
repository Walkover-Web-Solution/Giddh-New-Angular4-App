import { getCompaniesController } from "../controllers/companies";

/**
 * Companies routes
 *
 * @export
 * @param {*} app
 */
export function getCompaniesRoutes(app: any): void {
    app.get('/users/:userUniqueName/v2/companies', getCompaniesController);
}