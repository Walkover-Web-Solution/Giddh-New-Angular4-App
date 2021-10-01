import checkInternetConnected from "check-internet-connected";
import { getInternetConnectedConfig } from "../helpers/general";
import { getFinancialYearLimitsGiddh, getFinancialYearsGiddh } from "../services/giddh/financial-years";
import { getFinancialYearLimitsLocal, getFinancialYearsLocal, saveFinancialYearLimitsLocal, saveFinancialYearsLocal } from "../services/local/financial-years";

/**
 * This will return financial years list (if internet is available, it will fetch list of financial years from giddh otherwise will return list of financial years from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getFinancialYearsController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getFinancialYearsGiddh(req, res);
            const finalResponse = await saveFinancialYearsLocal(req, response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getFinancialYearsLocal(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}

/**
 * This will return financial year limits (if internet is available, it will fetch limits of financial years from giddh otherwise will return limits of financial years from local db)
 *
 * @param {*} req
 * @param {*} res
 */
 export function getFinancialYearLimitsController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getFinancialYearLimitsGiddh(req, res);
            const finalResponse = await saveFinancialYearLimitsLocal(req, response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getFinancialYearLimitsLocal(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}