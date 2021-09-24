import Datastore from "nedb";
import { findAsync, insertAsync, removeAsync } from "../../helpers/nedb_async";
import { cleanCompanyData, getPath } from "../../helpers/general";

/**
 * This will save the active company information
 *
 * @param {*} request
 * @returns
 */
export async function saveCompanyLocal(request: any): Promise<any> {
    if (request && request.status === "success") {
        const companyData = cleanCompanyData(request.body);
        const filename = getPath("company.db");
        const db = new Datastore({ filename: filename, autoload: true });

        /** Removing the company data if exists already */
        await removeAsync(db, {}, {});
        /** Inserting the company data */
        await insertAsync(db, companyData);

        return { status: "success", body: companyData };
    } else {
        return { status: "error", message: request.message };
    }
}

/**
 * This will return the active company information
 *
 * @param {*} request
 * @returns
 */
export async function getCompanyLocal(request: any): Promise<any> {
    const filename = getPath("company.db");
    const db = new Datastore({ filename: filename, autoload: true });

    /** Finding the company data */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response[0] };
    } else {
        return { status: "error", message: "Company details unavailable." };
    }
}