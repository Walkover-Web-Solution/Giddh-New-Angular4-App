import { getBranchesController } from "../controllers/branches";

/**
 * Branches routes
 *
 * @param {*} app
 */
export function getBranchesRoutes(app) {
    app.get('/company/:companyUniqueName/branch', getBranchesController);
}