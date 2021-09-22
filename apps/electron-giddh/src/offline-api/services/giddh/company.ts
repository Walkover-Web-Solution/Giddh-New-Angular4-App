import { callApi } from "../../helpers/apicall";
import { getApiUrl } from "../../helpers/environment";

/**
 * This will get the company details
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getCompanyGiddh(req: any, res: any): Promise<any> {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Session-Id': req.headers['session-id']
        }
    }

    const url = getApiUrl(req) + 'company/' + req.params.companyUniqueName;
    return callApi(url, options);
}