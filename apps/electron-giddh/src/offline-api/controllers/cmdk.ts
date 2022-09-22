import checkInternetConnected from "check-internet-connected";
import { checkIfFileLocked, getInternetConnectedConfig, getPath, lockFile, unlockFile, waitForFileUnlock } from "../helpers/general";
import { getCmdkGiddh } from "../services/giddh/cmdk";
import { getCmdkLocal, saveCmdkLocal } from "../services/local/cmdk";

/**
 * This will return cmdk options list (if internet is available, it will fetch list of cmdk options from giddh otherwise will return list of cmdk options from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getCmdkController(req: any, res: any) {
    const filename = getPath("cmdk-" + req.params.companyUniqueName + ".db");
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getCmdkGiddh(req, res);
            
            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await saveCmdkLocal(filename, req, response);

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

            const finalResponse = await getCmdkLocal(filename, req);
            
            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
            res.json({ status: "error", "message": error.message });
        }
    });
}