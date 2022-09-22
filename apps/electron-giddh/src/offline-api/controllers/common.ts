import checkInternetConnected from "check-internet-connected";
import { checkIfFileLocked, getInternetConnectedConfig, getPath, lockFile, unlockFile, waitForFileUnlock } from "../helpers/general";
import { getCurrenciesGiddh, getEntrySettingsGiddh, getSidebarMenusGiddh } from "../services/giddh/common";
import { getCurrenciesLocal, getEntrySettingsLocal, getSidebarMenusLocal, saveCurrenciesLocal, saveEntrySettingsLocal, saveSidebarMenusLocal } from "../services/local/common";

/**
 * This will return currencies list (if internet is available, it will fetch list of currencies from giddh otherwise will return list of currencies from local db)
 *
 * @param {*} req
 * @param {*} res
 */
export function getCurrenciesController(req: any, res: any) {
    const filename = getPath("currencies.db");
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getCurrenciesGiddh(req, res);

            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await saveCurrenciesLocal(filename, response);

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

            const finalResponse = await getCurrenciesLocal(filename, req);

            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
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
export function getSidebarMenusController(req: any, res: any) {
    const filename = getPath("sidebar-menus-" + req.params.companyUniqueName + ".db");
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getSidebarMenusGiddh(req, res);

            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await saveSidebarMenusLocal(filename, req, response);

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

            const finalResponse = await getSidebarMenusLocal(filename, req);

            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
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
export function getEntrySettingsController(req: any, res: any) {
    const filename = getPath("entry-settings-" + req.params.companyUniqueName + ".db");
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getEntrySettingsGiddh(req, res);

            if (checkIfFileLocked(filename)) {
                await waitForFileUnlock(filename);
            }
            lockFile(filename);

            const finalResponse = await saveEntrySettingsLocal(filename, req, response);

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

            const finalResponse = await getEntrySettingsLocal(filename, req);

            unlockFile(filename);
            res.json(finalResponse);
        } catch (error) {
            unlockFile(filename);
            res.json({ status: "error", "message": error.message });
        }
    });
}