import checkInternetConnected from "check-internet-connected";
import { getInternetConnectedConfig } from "../helpers/general";
import { getCurrenciesGiddh, getEntrySettingsGiddh, getSidebarMenusGiddh } from "../services/giddh/common";
import { getCurrenciesLocal, getEntrySettingsLocal, getSidebarMenusLocal, saveCurrenciesLocal, saveEntrySettingsLocal, saveSidebarMenusLocal } from "../services/local/common";

/**
 * This will return currencies list (if internet is available, it will fetch list of currencies from giddh otherwise will return list of currencies from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getCurrenciesController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getCurrenciesGiddh(req, res);
            const finalResponse = await saveCurrenciesLocal(response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getCurrenciesLocal(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}

/**
 * This will return sidebar menus list (if internet is available, it will fetch list of sidebar menus from giddh otherwise will return list of sidebar menus from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getSidebarMenusController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getSidebarMenusGiddh(req, res);
            const finalResponse = await saveSidebarMenusLocal(req, response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getSidebarMenusLocal(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}

/**
 * This will return entry settings (if internet is available, it will fetch entry settings from giddh otherwise will return entry settings from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getEntrySettingsController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getEntrySettingsGiddh(req, res);
            const finalResponse = await saveEntrySettingsLocal(req, response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getEntrySettingsLocal(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}