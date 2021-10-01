import checkInternetConnected from "check-internet-connected";
import { getInternetConnectedConfig } from "../helpers/general";
import { getUserGiddh } from "../services/giddh/user";
import { getUserLocal, saveUserLocal } from "../services/local/user";

/**
 * This will return user data (if internet is available, it will fetch user data from giddh otherwise will return user data from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getUserController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getUserGiddh(req, res);
            const finalResponse = await saveUserLocal(response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getUserLocal(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}