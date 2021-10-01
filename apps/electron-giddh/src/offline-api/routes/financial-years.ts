import { getFinancialYearLimitsController, getFinancialYearsController } from "../controllers/financial-years";

/**
 * Financial year routes
 *
 * @export
 * @param {*} app
 */
export function getFinancialYearsRoutes(app: any): void {
    app.get('/company/:companyUniqueName/financial-year', getFinancialYearsController);
    app.get('/company/:companyUniqueName/financial-year-limits', getFinancialYearLimitsController);
}