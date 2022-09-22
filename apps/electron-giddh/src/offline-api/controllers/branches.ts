import checkInternetConnected from "check-internet-connected";
import { getBranchesGiddh } from "../services/giddh/branches";
import { checkIfFileLocked, getInternetConnectedConfig, getPath, lockFile, unlockFile, waitForFileUnlock } from "../helpers/general";
import { getBranchesLocal, saveBranchesLocal } from "../services/local/branches";

/**
 * This will return branches list (if internet is available, it will fetch list of branches from giddh otherwise will return list of branches from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getBranchesController(req: any, res: any) {
    const filename = getPath("branches-" + req.params.companyUniqueName + ".db");
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getBranchesGiddh(req, res);

            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await saveBranchesLocal(filename, req, response);

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

            const finalResponse = await getBranchesLocal(filename, req);
            
            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
            res.json({ status: "error", "message": error.message });
        }
    });
}