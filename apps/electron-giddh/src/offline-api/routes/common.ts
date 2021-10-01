import { getCurrenciesController, getEntrySettingsController, getSidebarMenusController } from "../controllers/common";

/**
 * Common routes
 *
 * @export
 * @param {*} app
 */
export function getCommonRoutes(app: any): void {
    app.get('/currency', getCurrenciesController);
    app.get('/company/:companyUniqueName/ui_side_bar_items', getSidebarMenusController);
    app.get('/company/:companyUniqueName/entry-settings', getEntrySettingsController);
}