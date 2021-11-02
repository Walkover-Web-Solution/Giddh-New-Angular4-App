import Datastore from "nedb";
import { findAsync, insertAsync, loadDatabase, removeAsync } from "../../helpers/nedb_async";
import { checkIfFileLocked, getPath, lockFile, unlockFile, waitForFileUnlock } from "../../helpers/general";

/**
 * This will save the financial years list
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
export async function saveFinancialYearsLocal(request: any, response: any): Promise<any> {
    if (response && response.status === "success") {
        const financialYearsList = response.body;
        const filename = getPath("financial-years-" + request.params.companyUniqueName + ".db");
        if(checkIfFileLocked(filename)) {
            await waitForFileUnlock(filename);
        }
        lockFile(filename);
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the financial years list if exists already */
        await removeAsync(db, {}, { multi: true });
        /** Inserting the financial years list */
        await insertAsync(db, financialYearsList);

        unlockFile(filename);

        return { status: "success", body: financialYearsList };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the list of financial years
 *
 * @param {*} request
 * @returns
 */
export async function getFinancialYearsLocal(request: any): Promise<any> {
    const filename = getPath("financial-years-" + request.params.companyUniqueName + ".db");
    if(checkIfFileLocked(filename)) {
        await waitForFileUnlock(filename);
    }
    lockFile(filename);
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the financial years list */
    const response = await findAsync(db, {});
    
    unlockFile(filename);

    if (response?.length > 0) {
        return { status: "success", body: response[0] };
    } else {
        return { status: "error", message: "Financial years list unavailable." };
    }
}

/**
 * This will save the financial year limits
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
 export async function saveFinancialYearLimitsLocal(request: any, response: any): Promise<any> {
    if (response && response.status === "success") {
        const financialYearsLimits = response.body;
        const filename = getPath("financial-year-limits-" + request.params.companyUniqueName + ".db");
        if(checkIfFileLocked(filename)) {
            await waitForFileUnlock(filename);
        }
        lockFile(filename);
        const db = new Datastore({ filename: filename });

        /** Connecting to database */
        await loadDatabase(db);
        /** Removing the financial years limits if exists already */
        await removeAsync(db, {}, {});
        /** Inserting the financial years limits */
        await insertAsync(db, financialYearsLimits);

        unlockFile(filename);

        return { status: "success", body: financialYearsLimits };
    } else {
        return { status: "error", message: response?.message };
    }
}

/**
 * This will return the limits of financial years
 *
 * @param {*} request
 * @returns
 */
export async function getFinancialYearLimitsLocal(request: any): Promise<any> {
    const filename = getPath("financial-year-limits-" + request.params.companyUniqueName + ".db");
    if(checkIfFileLocked(filename)) {
        await waitForFileUnlock(filename);
    }
    lockFile(filename);
    const db = new Datastore({ filename: filename });

    /** Connecting to database */
    await loadDatabase(db);
    /** Finding the financial years limits */
    const response = await findAsync(db, {});

    unlockFile(filename);

    if (response?.length > 0) {
        return { status: "success", body: response[0] };
    } else {
        return { status: "error", message: "Financial year limits unavailable." };
    }
}