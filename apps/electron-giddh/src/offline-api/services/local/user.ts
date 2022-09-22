import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";

/**
 * This will save the active user information
 *
 * @param {*} response
 * @returns
 */
export async function saveUserLocal(filename: string, response: any): Promise<any> {
    if (response && response.status === "success") {
        const userData = response.body;
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the user data if exists already */
        await removeAsync(db, {}, {});
        /** Inserting the user data */
        await insertAsync(db, userData);

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
export async function getUserLocal(filename: string, request: any): Promise<any> {
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