import checkInternetConnected from "check-internet-connected";
import { getBranchesGiddh } from "../services/giddh/branches";
import { getInternetConnectedConfig } from "../helpers/general";
import { getBranchesLocal, saveBranchesLocal } from "../services/local/branches";

/**
 * This will return branches list (if internet is available, it will fetch list of branches from giddh otherwise will return list of branches from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getBranchesController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getBranchesGiddh(req, res);
            const finalResponse = await saveBranchesLocal(req, response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getBranchesLocal(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}