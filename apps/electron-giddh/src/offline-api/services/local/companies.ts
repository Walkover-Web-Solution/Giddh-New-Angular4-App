import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";

/**
 * This will save the companies list
 *
 * @param {string} filename
 * @param {*} response
 * @returns
 */
export async function saveCompaniesLocal(filename: string, response: any): Promise<any> {
    if (response && response.status === "success") {
        const companiesList = response.body;
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the companies list if exists already */
        await removeAsync(db, {}, { multi: true });
        /** Inserting the companies list */
        await insertAsync(db, companiesList);

        return { status: "success", body: companiesList };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the list of companies
 *
 * @param {string} filename
 * @param {*} request
 * @returns
 */
export async function getCompaniesLocal(filename: string, request: any): Promise<any> {
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the companies list */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response, filename: filename };
    } else {
        return { status: "error", message: "Companies list unavailable.", filename: filename };
    }
}