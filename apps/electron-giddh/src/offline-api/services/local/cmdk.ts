import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";
import * as appAath from "path";

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
    const start = (request.query.page - 1) + limit;
    const response = (request.query.q) ? await findAsync(db, { query: { results: { name: request.query.q } }, start: start, limit: limit }) : await findAsync(db, { start: start, limit: limit });

    if (response?.length > 0) {
        return { status: "success", body: response[0], filename: filename };
    } else {
        return { status: "error", message: "No results found.", filename: filename };
    }
}