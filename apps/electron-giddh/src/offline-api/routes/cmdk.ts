import { getCmdkController } from "../controllers/cmdk";

/**
 * Cmdk routes
 *
 * @export
 * @param {*} app
 */
export function getCmdkRoutes(app: any): void {
    app.get('/company/:companyUniqueName/cmdk', getCmdkController);
}