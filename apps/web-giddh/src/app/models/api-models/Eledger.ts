import { IEledgerTransaction } from '../interfaces/eledger.interface';

/*
 * Model for get eledger transactions api request
 * GET call
 * API:: ( mail ledger ) company/:companyUniqueName/accounts/:accountUniqueName/eledgers?refresh=false
 * Response will be success message and array of EledgerResponse in body
 */
export class EledgerResponse {
    public transactions: IEledgerTransaction[];
    public transactionId: string;
    public date: string;
}

/*
 * Model for trash eledger transaction api request
 * PUT call
 * API:: ( mail ledger ) company/:companyUniqueName/accounts/:accountUniqueName/eledgers/map/:transactionId
 * Response will be success message
 */

export class EledgerMapRequest {
    public uniqueName: string;
}
