import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";

/**
 * This will save the currencies list
 *
 * @param {string} filename
 * @param {*} response
 * @returns
 */
export async function saveCurrenciesLocal(filename: string, response: any): Promise<any> {
    if (response && response.status === "success") {
        const currenciesList = response.body;
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the currencies list if exists already */
        await removeAsync(db, {}, { multi: true });
        /** Inserting the currencies list */
        await insertAsync(db, currenciesList);

        return { status: "success", body: currenciesList };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the list of currencies
 *
 * @param {string} filename
 * @param {*} request
 * @returns
 */
export async function getCurrenciesLocal(filename: string, request: any): Promise<any> {
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the currencies list */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response };
    } else {
        return { status: "error", message: "Currencies list unavailable." };
    }
}

/**
 * This will save the sidebar menus list
 *
 * @param {string} filename
 * @param {*} response
 * @returns
 */
export async function saveSidebarMenusLocal(filename: string, request: any, response: any): Promise<any> {
    if (response && response.status === "success") {
        const sidebarMenusList = response.body;
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the sidebar menus list if exists already */
        await removeAsync(db, {}, { multi: true });
        /** Inserting the sidebar menus list */
        await insertAsync(db, sidebarMenusList);

        return { status: "success", body: sidebarMenusList };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the list of sidebar menus
 *
 * @param {string} filename
 * @param {*} request
 * @returns
 */
export async function getSidebarMenusLocal(filename: string, request: any): Promise<any> {
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the sidebar menus list */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response };
    } else {
        return { status: "error", message: "Sidebar menus list unavailable." };
    }
}

/**
 * This will save the entry settings
 *
 * @param {string} filename
 * @param {*} response
 * @returns
 */
export async function saveEntrySettingsLocal(filename: string, request: any, response: any): Promise<any> {
    if (response && response.status === "success") {
        const entrySettings = response.body;
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the entry settings if exists already */
        await removeAsync(db, {}, {});
        /** Inserting the entry settings */
        await insertAsync(db, entrySettings);

        return { status: "success", body: entrySettings };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the entry settings
 *
 * @param {string} filename
 * @param {*} request
 * @returns
 */
export async function getEntrySettingsLocal(filename: string, request: any): Promise<any> {
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the entry settings */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response[0] };
    } else {
        return { status: "error", message: "Entry settings unavailable." };
    }
}