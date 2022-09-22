import checkInternetConnected from "check-internet-connected";
import { checkIfFileLocked, getInternetConnectedConfig, getPath, lockFile, unlockFile, waitForFileUnlock } from "../helpers/general";
import { getCompanyGiddh } from "../services/giddh/company";
import { getCompanyLocal, saveCompanyLocal } from "../services/local/company";

/**
 * This will return company data (if internet is available, it will fetch company data from giddh otherwise will return company data from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getCompanyController(req: any, res: any) {
    const filename = getPath("company-" + req.params.companyUniqueName + ".db");
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getCompanyGiddh(req, res);

            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await saveCompanyLocal(filename, req, response);

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

            const finalResponse = await getCompanyLocal(filename, req);

            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
            res.json({ status: "error", "message": error.message });
        }
    });
}