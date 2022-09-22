import checkInternetConnected from "check-internet-connected";
import { checkIfFileLocked, getInternetConnectedConfig, getPath, lockFile, unlockFile, waitForFileUnlock } from "../helpers/general";
import { getUserGiddh } from "../services/giddh/user";
import { getUserLocal, saveUserLocal } from "../services/local/user";

/**
 * This will return user data (if internet is available, it will fetch user data from giddh otherwise will return user data from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getUserController(req: any, res: any) {
    const filename = getPath("user.db");
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getUserGiddh(req, res);

            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await saveUserLocal(filename, response);

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
            
            const finalResponse = await getUserLocal(filename, req);

            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
            res.json({ status: "error", "message": error.message });
        }
    });
}