import { callApi } from "../../helpers/apicall";
import { getApiUrl } from "../../helpers/environment";
import { getDefaultApiOptions, getDefaultQueryParams } from "../../helpers/general";

/**
 * This will get the company details
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getCompanyGiddh(req: any, res: any): Promise<any> {
    const options = getDefaultApiOptions(req, 'GET');
    const params = getDefaultQueryParams(req);
    const url = getApiUrl(req) + 'company/' + req.params.companyUniqueName + "?" + params;
    return callApi(url, options);
}