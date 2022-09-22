import { getBranchesController } from "../controllers/branches";

/**
 * Branches routes
 *
 * @export
 * @param {*} app
 */
export function getBranchesRoutes(app: any): void {
    app.get('/company/:companyUniqueName/branch', getBranchesController);
}