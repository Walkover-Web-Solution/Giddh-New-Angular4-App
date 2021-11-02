import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";

/**
 * This will save the financial years list
 *
 * @param {string} filename
 * @param {*} request
 * @param {*} response
 * @returns
 */
export async function saveFinancialYearsLocal(filename: string, request: any, response: any): Promise<any> {
    if (response && response.status === "success") {
        const financialYearsList = response.body;
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the financial years list if exists already */
        await removeAsync(db, {}, { multi: true });
        /** Inserting the financial years list */
        await insertAsync(db, financialYearsList);

        return { status: "success", body: financialYearsList };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the list of financial years
 *
 * @param {string} filename
 * @param {*} request
 * @returns
 */
export async function getFinancialYearsLocal(filename: string, request: any): Promise<any> {
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the financial years list */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response[0] };
    } else {
        return { status: "error", message: "Financial years list unavailable." };
    }
}

/**
 * This will save the financial year limits
 *
 * @param {string} filename
 * @param {*} request
 * @param {*} response
 * @returns
 */
export async function saveFinancialYearLimitsLocal(filename: string, request: any, response: any): Promise<any> {
    if (response && response.status === "success") {
        const financialYearsLimits = response.body;
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the financial years limits if exists already */
        await removeAsync(db, {}, {});
        /** Inserting the financial years limits */
        await insertAsync(db, financialYearsLimits);

        return { status: "success", body: financialYearsLimits };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the limits of financial years
 *
 * @param {string} filename
 * @param {*} request
 * @returns
 */
export async function getFinancialYearLimitsLocal(filename: string, request: any): Promise<any> {
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the financial years limits */
    const response = await findAsync(db, {});

    if (response?.length > 0) {
        return { status: "success", body: response[0] };
    } else {
        return { status: "error", message: "Financial year limits unavailable." };
    }
}