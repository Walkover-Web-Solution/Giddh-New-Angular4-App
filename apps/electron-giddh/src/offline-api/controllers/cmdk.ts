import checkInternetConnected from "check-internet-connected";
import { getInternetConnectedConfig } from "../helpers/general";
import { getCmdkGiddh } from "../services/giddh/cmdk";
import { getCmdkLocal, saveCmdkLocal } from "../services/local/cmdk";

/**
 * This will return cmdk options list (if internet is available, it will fetch list of cmdk options from giddh otherwise will return list of cmdk options from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getCmdkController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getCmdkGiddh(req, res);
            const finalResponse = await saveCmdkLocal(req, response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getCmdkLocal(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}