import { callApi } from "../../helpers/apicall";
import { getApiUrl } from "../../helpers/environment";
import { getDefaultApiOptions } from "../../helpers/general";

/**
 * This will get the list of companies
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getCompaniesGiddh(req: any, res: any): Promise<any> {
    const options = getDefaultApiOptions(req, 'GET');
    const url = getApiUrl(req) + 'users/' + req.params.userUniqueName + '/v2/companies';
    return callApi(url, options);
}