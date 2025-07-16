/** Sales Bifurcation Details Create Update */
export interface SalesBifurcationDetailsCreateUpdate {
    name: string,
    email: string,
    mobileNumber: string,
    uniqueName?: string
}

/** Sales Bifurcation Details Action Enum */
export enum SalesBifurcationDetailsActionEnum {
    GET_ALL = 'get'
}
