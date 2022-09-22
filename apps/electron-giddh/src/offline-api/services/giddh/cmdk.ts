import { callApi } from "../../helpers/apicall";
import { getApiUrl } from "../../helpers/environment";
import { getDefaultApiOptions, getDefaultQueryParams } from "../../helpers/general";

/**
 * This will get the list of cmdk options
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getCmdkGiddh(req: any, res: any): Promise<any> {
    const options = getDefaultApiOptions(req, 'GET');
    const params = getDefaultQueryParams(req);
    const url = getApiUrl(req) + 'company/' + req.params.companyUniqueName + '/cmdk?page=' + req.query.page + "&q=" + req.query.q + "&group=" + req.query.group + "&refresh=" + req.query.refresh + "&isMobile=" + req.query.isMobile + "&" + params;
    return callApi(url, options);
}