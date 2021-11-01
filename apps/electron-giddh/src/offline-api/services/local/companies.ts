import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";
import { checkIfFileLocked, getPath, lockFile, unlockFile, waitForFileUnlock } from "../../helpers/general";

/**
 * This will save the companies list
 *
 * @param {*} response
 * @returns
 */
export async function saveCompaniesLocal(response: any): Promise<any> {
    if (response && response.status === "success") {
        const companiesList = response.body;
        const filename = getPath("companies.db");
        if(checkIfFileLocked(filename)) {
            await waitForFileUnlock(filename);
        }
        lockFile(filename);
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the companies list if exists already */
        await removeAsync(db, {}, { multi: true });
        /** Inserting the companies list */
        await insertAsync(db, companiesList);

        unlockFile(filename);

        return { status: "success", body: companiesList };
    } else {
        return { status: "error", message: response?.message };
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
    if(checkIfFileLocked(filename)) {
        await waitForFileUnlock(filename);
    }
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