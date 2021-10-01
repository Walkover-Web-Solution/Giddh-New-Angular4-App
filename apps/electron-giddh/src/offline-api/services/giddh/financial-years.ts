import { callApi } from "../../helpers/apicall";
import { getApiUrl } from "../../helpers/environment";
import { getDefaultApiOptions, getDefaultQueryParams } from "../../helpers/general";

/**
 * This will get the list of financial years
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getFinancialYearsGiddh(req: any, res: any): Promise<any> {
    const options = getDefaultApiOptions(req, 'GET');
    const params = getDefaultQueryParams(req);
    const url = getApiUrl(req) + 'company/' + req.params.companyUniqueName + '/financial-year?' + params;
    return callApi(url, options);
}

/**
 * This will get the limits of financial years
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
 export async function getFinancialYearLimitsGiddh(req: any, res: any): Promise<any> {
    const options = getDefaultApiOptions(req, 'GET');
    const params = getDefaultQueryParams(req);
    const url = getApiUrl(req) + 'company/' + req.params.companyUniqueName + '/financial-year-limits?' + params;
    return callApi(url, options);
}