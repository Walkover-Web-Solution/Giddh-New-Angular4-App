import { getCompanyController } from "../controllers/company";

/**
 * Company routes
 *
 * @export
 * @param {*} app
 */
export function getCompanyRoutes(app: any): void {
    app.get('/company/:companyUniqueName', getCompanyController);
}