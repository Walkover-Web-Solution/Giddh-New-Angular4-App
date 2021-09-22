import { cleanCompanyData } from "../../helpers/general";

/**
 * This will save the active company information
 *
 * @param {*} request
 * @returns
 */
export async function saveCompanyLocal(request: any): Promise<any> {
    if (request && request.status === "success") {

        const companyData = cleanCompanyData(request.body);



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
    const company = {};

    if (company) {
        return { status: "success", body: company[0] };
    } else {
        return { status: "error", message: "Company details unavailable." };
    }
}