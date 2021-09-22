import checkInternetConnected from "check-internet-connected";
import { getCompaniesGiddh } from "../services/giddh/companies";
import { getInternetConnectedConfig } from "../helpers/general";
import { getCompaniesLocal, saveCompaniesLocal } from "../services/local/companies";

/**
 * This will return companies list (if internet is available, it will fetch list of companies from giddh otherwise will return list of companies from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getCompaniesController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getCompaniesGiddh(req, res);
            const finalResponse = await saveCompaniesLocal(response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getCompaniesLocal(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}