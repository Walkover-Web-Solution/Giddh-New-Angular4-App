import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";
import { getPath } from "../../helpers/general";

/**
 * This will save the cmdk options list
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
export async function saveCmdkLocal(request: any, response: any): Promise<any> {
    if (response && response.status === "success") {
        const cmdkOptionsList = response.body;
        const filename = getPath("cmdk-" + request.params.companyUniqueName + ".db");
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the cmdk options list if exists already */
        await removeAsync(db, {}, { multi: true });
        /** Inserting the cmdk options list */
        await insertAsync(db, cmdkOptionsList);

        return { status: "success", body: cmdkOptionsList };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the list of cmdk options
 *
 * @param {*} request
 * @returns
 */
export async function getCmdkLocal(request: any): Promise<any> {
    const filename = getPath("cmdk-" + request.params.companyUniqueName + ".db");
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the cmdk options list */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response[0] };
    } else {
        return { status: "error", message: "Cmdk list unavailable." };
    }
}