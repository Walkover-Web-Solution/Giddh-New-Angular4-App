import { callApi } from "../../helpers/apicall";
import { getApiUrl } from "../../helpers/environment";
import { getDefaultApiOptions, getDefaultQueryParams } from "../../helpers/general";

/**
 * This will get the list of companies
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getCompaniesGiddh(req: any, res: any): Promise<any> {
    const options = getDefaultApiOptions(req, 'GET');
    const params = getDefaultQueryParams(req);
    const url = getApiUrl(req) + 'users/' + req.params.userUniqueName + '/v2/companies?' + params;
    return callApi(url, options);
}