import { callApi } from "../../helpers/apicall";
import { getApiUrl } from "../../helpers/environment";
import { getDefaultApiOptions } from "../../helpers/general";

/**
 * This will get the list of currencies
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getCurrenciesGiddh(req: any, res: any): Promise<any> {
    const options = getDefaultApiOptions(req, 'GET');
    const url = getApiUrl(req) + 'currency';
    return callApi(url, options);
}

/**
 * This will get the list of sidebar menus
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getSidebarMenusGiddh(req: any, res: any): Promise<any> {
    const options = getDefaultApiOptions(req, 'GET');
    const url = getApiUrl(req) + 'company/' + req.params.companyUniqueName + '/ui_side_bar_items';
    return callApi(url, options);
}

/**
 * This will get the list of sidebar menus
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
 export async function getEntrySettingsGiddh(req: any, res: any): Promise<any> {
    const options = getDefaultApiOptions(req, 'GET');
    const url = getApiUrl(req) + 'company/' + req.params.companyUniqueName + '/entry-settings';
    return callApi(url, options);
}