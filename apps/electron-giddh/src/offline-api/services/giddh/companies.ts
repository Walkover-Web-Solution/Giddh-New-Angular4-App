import { callApi } from "../../helpers/apicall";
import { getApiUrl } from "../../helpers/environment";

/**
 * This will get the list of companies
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getCompaniesGiddh(req: any, res: any): Promise<any> {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Session-Id': req.headers['session-id']
        }
    }

    const url = getApiUrl(req) + 'users/' + req.params.userUniqueName + '/v2/companies';
    return callApi(url, options);
}