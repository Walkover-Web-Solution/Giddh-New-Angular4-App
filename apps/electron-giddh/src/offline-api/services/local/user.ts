import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";
import { checkIfFileLocked, getPath, lockFile, unlockFile, waitForFileUnlock } from "../../helpers/general";

/**
 * This will save the active user information
 *
 * @param {*} response
 * @returns
 */
export async function saveUserLocal(response: any): Promise<any> {
    if (response && response.status === "success") {
        const userData = response.body;
        const filename = getPath("user.db");
        if(checkIfFileLocked(filename)) {
            await waitForFileUnlock(filename);
        }
        lockFile(filename);
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the user data if exists already */
        await removeAsync(db, {}, {});
        /** Inserting the user data */
        await insertAsync(db, userData);

        unlockFile(filename);

        return { status: "success", body: userData };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the active user information
 *
 * @param {*} request
 * @returns
 */
export async function getUserLocal(request: any): Promise<any> {
    const filename = getPath("user.db");
    if(checkIfFileLocked(filename)) {
        await waitForFileUnlock(filename);
    }
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the user data */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response[0] };
    } else {
        return { status: "error", message: "User details unavailable." };
    }
}