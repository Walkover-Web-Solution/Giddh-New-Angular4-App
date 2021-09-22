import checkInternetConnected from "check-internet-connected";
import { getInternetConnectedConfig } from "../helpers/general";
import { getCompanyGiddh } from "../services/giddh/company";
import { getCompanyLocal, saveCompanyLocal } from "../services/local/company";

/**
 * This will return company data (if internet is available, it will fetch company data from giddh otherwise will return company data from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getCompanyController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getCompanyGiddh(req, res);
            const finalResponse = await saveCompanyLocal(response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getCompanyLocal(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}