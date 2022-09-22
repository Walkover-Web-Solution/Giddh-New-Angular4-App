import { callApi } from "../../helpers/apicall";
import { getApiUrl } from "../../helpers/environment";
import { getDefaultApiOptions, getDefaultQueryParams } from "../../helpers/general";

/**
 * This will get the list of branches
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getBranchesGiddh(req: any, res: any): Promise<any> {
    const options = getDefaultApiOptions(req, 'GET');
    const params = getDefaultQueryParams(req);
    const url = getApiUrl(req) + 'company/' + req.params.companyUniqueName + '/branch?' + params;
    return callApi(url, options);
}