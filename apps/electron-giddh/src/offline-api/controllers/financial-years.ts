import checkInternetConnected from "check-internet-connected";
import { checkIfFileLocked, getInternetConnectedConfig, getPath, lockFile, unlockFile, waitForFileUnlock } from "../helpers/general";
import { getFinancialYearLimitsGiddh, getFinancialYearsGiddh } from "../services/giddh/financial-years";
import { getFinancialYearLimitsLocal, getFinancialYearsLocal, saveFinancialYearLimitsLocal, saveFinancialYearsLocal } from "../services/local/financial-years";

/**
 * This will return financial years list (if internet is available, it will fetch list of financial years from giddh otherwise will return list of financial years from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getFinancialYearsController(req: any, res: any) {
    const filename = getPath("financial-years-" + req.params.companyUniqueName + ".db");
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getFinancialYearsGiddh(req, res);

            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await saveFinancialYearsLocal(filename, req, response);

            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await getFinancialYearsLocal(filename, req);

            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
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
export function getFinancialYearLimitsController(req: any, res: any) {
    const filename = getPath("financial-year-limits-" + req.params.companyUniqueName + ".db");
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getFinancialYearLimitsGiddh(req, res);

            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await saveFinancialYearLimitsLocal(filename, req, response);

            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await getFinancialYearLimitsLocal(filename, req);

            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
            res.json({ status: "error", "message": error.message });
        }
    });
}