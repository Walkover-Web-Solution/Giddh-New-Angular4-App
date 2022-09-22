import checkInternetConnected from "check-internet-connected";
import { getCompaniesGiddh } from "../services/giddh/companies";
import { checkIfFileLocked, getInternetConnectedConfig, getPath, lockFile, unlockFile, waitForFileUnlock } from "../helpers/general";
import { getCompaniesLocal, saveCompaniesLocal } from "../services/local/companies";

/**
 * This will return companies list (if internet is available, it will fetch list of companies from giddh otherwise will return list of companies from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getCompaniesController(req: any, res: any) {
    const filename = getPath("companies.db");
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getCompaniesGiddh(req, res);

            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await saveCompaniesLocal(filename, response);

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

            const finalResponse = await getCompaniesLocal(filename, req);

            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
            res.json({ status: "error", "message": error.message });
        }
    });
}