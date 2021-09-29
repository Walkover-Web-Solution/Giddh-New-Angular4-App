import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";
import { getPath } from "../../helpers/general";

/**
 * This will save the companies list
 *
 * @param {*} request
 * @returns
 */
export async function saveCompaniesLocal(request): Promise<any> {
    if (request && request.status === "success") {
        const companiesList = request.body;
        const filename = getPath("companies.db");
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the companies list if exists already */
        await removeAsync(db, {}, { multi: true });
        /** Inserting the companies list */
        await insertAsync(db, companiesList);

        return { status: "success", body: companiesList };
    } else {
        return { status: "error", message: request.message };
    }
}

/**
 * This will return the list of companies
 *
 * @param {*} request
 * @returns
 */
export async function getCompaniesLocal(request: any): Promise<any> {
    const filename = getPath("companies.db");
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the companies list */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response };
    } else {
        return { status: "error", message: "Companies list unavailable." };
    }
}