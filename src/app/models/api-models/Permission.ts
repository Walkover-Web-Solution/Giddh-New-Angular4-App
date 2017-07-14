/**
 * Created by ad on 13-07-2017.
 */

export interface PermissionResponse {
    name: string,
    scopes: any,
    uniqueName: string,
    isFixed: boolean,
    companyUniqueName: string
}

export interface PermissionRequest {
    companyUniqueName: string;
}
