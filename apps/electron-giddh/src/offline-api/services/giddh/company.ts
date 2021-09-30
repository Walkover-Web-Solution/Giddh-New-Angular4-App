import { callApi } from "../../helpers/apicall";
import { getApiUrl } from "../../helpers/environment";
import { getDefaultApiOptions } from "../../helpers/general";

/**
 * This will get the company details
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getCompanyGiddh(req: any, res: any): Promise<any> {
    const options = getDefaultApiOptions(req, 'GET');
    const url = getApiUrl(req) + 'company/' + req.params.companyUniqueName;
    return callApi(url, options);
}