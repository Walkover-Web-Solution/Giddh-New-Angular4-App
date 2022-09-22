import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";

/**
 * This will save the active company information
 *
 * @param {string} filename
 * @param {*} request
 * @param {*} response
 * @returns
 */
export async function saveCompanyLocal(filename: string, request: any, response: any): Promise<any> {
    if (response && response.status === "success") {
        const companyData = response.body;
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the company data if exists already */
        await removeAsync(db, {}, {});
        /** Inserting the company data */
        await insertAsync(db, companyData);

        return { status: "success", body: companyData };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the active company information
 *
 * @param {string} filename
 * @param {*} request
 * @returns
 */
export async function getCompanyLocal(filename: string, request: any): Promise<any> {
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the company data */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response[0] };
    } else {
        return { status: "error", message: "Company details unavailable." };
    }
}