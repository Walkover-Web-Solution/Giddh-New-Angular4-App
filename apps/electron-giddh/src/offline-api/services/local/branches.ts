import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";
import { checkIfFileLocked, getPath, lockFile, unlockFile, waitForFileUnlock } from "../../helpers/general";

/**
 * This will save the branches list
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
export async function saveBranchesLocal(request: any, response: any): Promise<any> {
    if (response && response.status === "success") {
        const branchesList = response.body;
        const filename = getPath("branches-" + request.params.companyUniqueName + ".db");
        if(checkIfFileLocked(filename)) {
            await waitForFileUnlock(filename);
        }
        lockFile(filename);
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the branches list if exists already */
        await removeAsync(db, {}, { multi: true });
        /** Inserting the branches list */
        await insertAsync(db, branchesList);

        unlockFile(filename);

        return { status: "success", body: branchesList };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the list of branches
 *
 * @param {*} request
 * @returns
 */
export async function getBranchesLocal(request: any): Promise<any> {
    const filename = getPath("branches-" + request.params.companyUniqueName + ".db");
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the branches list */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response };
    } else {
        return { status: "error", message: "Branches list unavailable." };
    }
}