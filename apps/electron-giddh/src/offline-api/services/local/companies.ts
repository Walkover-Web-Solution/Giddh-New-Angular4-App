/**
 * This will save the companies list
 *
 * @param {*} request
 * @returns
 */
export async function saveCompaniesLocal(request): Promise<any> {
    if (request && request.status === "success") {
        const companiesList = request.body;

        return { status: "success", body: companiesList };
    } else {
        return { status: "error", message: request.message };
    }
}

/**
 * This will return the list of companies
 *
 * @param {*} request
 * @returns
 */
export async function getCompaniesLocal(request: any): Promise<any> {
    const companies = {};

    if (companies) {
        return { status: "success", body: companies };
    } else {
        return { status: "error", message: "Companies list unavailable." };
    }
}