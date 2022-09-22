import Datastore from "nedb";
import { countAsync, findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";

/**
 * This will save the cmdk options list
 *
 * @param {string} filename
 * @param {*} request
 * @param {*} response
 * @returns
 */
export async function saveCmdkLocal(filename: string, request: any, response: any): Promise<any> {
    if (response && response.status === "success") {
        const cmdkOptionsList = response.body;
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
 * @param {string} filename
 * @param {*} request
 * @returns
 */
export async function getCmdkLocal(filename: string, request: any): Promise<any> {
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the cmdk options list */

    const limit = 20;
    const start = (request.params.page - 1) + limit;
    const response = (request.params.q) ? await findAsync(db, { query: { "results.type": "MENU", "results.name": request.params.q }, start: start, limit: limit }) : await findAsync(db, { start: start, limit: limit });
    const size = (request.params.q) ? await countAsync(db, { query: { "results.type": "MENU", "results.name": request.params.q } }) : await countAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response[0], size: size };
    } else {
        return { status: "error", message: "Cmdk list unavailable." };
    }
}