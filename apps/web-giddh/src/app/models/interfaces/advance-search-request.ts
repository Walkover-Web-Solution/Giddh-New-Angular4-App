import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { PAGINATION_LIMIT } from "../../app.constant";

/**
 * AdvanceSearchRequest class
 * Implements AdvanceSearchRequest functionality
 */
export class AdvanceSearchRequest {
    public dataToSend: AdvanceSearchModel = new AdvanceSearchModel();
    public q: string = '';
    public page: number = 0;
    public count: number = PAGINATION_LIMIT;
    public accountUniqueName: string = '';
    public sort: string = 'asc';
    public branchUniqueName: string = '';
    public reversePage: boolean = false;
    public paginationToken?: string = '';

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.dataToSend = new AdvanceSearchModel();
    }

    get from(): string {
        /**
         * Handles if functionality
         */
        if (this.dataToSend.bsRangeValue && this.dataToSend.bsRangeValue.length > 0) {
            return dayjs(this.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT);
        }
        return dayjs().subtract(30, 'day').format(GIDDH_DATE_FORMAT);
    }

    get to(): string {
        /**
         * Handles if functionality
         */
        if (this.dataToSend.bsRangeValue && this.dataToSend.bsRangeValue.length > 1) {
            return dayjs(this.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT);
        }
        return dayjs().format(GIDDH_DATE_FORMAT);
    }

    set to(val) {
        /**
         * Handles if functionality
         */
        if (val) {
            this.dataToSend.bsRangeValue[1] = val;
        }
    }
}

/**
 * AdvanceSearchModel class
 * Implements AdvanceSearchModel functionality
 */
export class AdvanceSearchModel {
    public bsRangeValue: any[];
    public uniqueNames: string[] = [];
    public isInvoiceGenerated: null;
    public accountUniqueNames: string[];
    public groupUniqueNames: string[];
    public amountLessThan: false;
    public includeAmount: false;
    public amountEqualTo: false;
    public amountGreaterThan: false;
    public amount: string;
    public includeDescription: false;
    public description: null;
    public includeTag: false;
    public includeParticulars: false;
    public includeVouchers: false;
    public chequeNumber: string;
    public dateOnCheque: string;
    public tags: string[];
    public particulars: string[];
    public vouchers: string[];
    public inventory: AdvanceSearchRequestInventory = new AdvanceSearchRequestInventory();
    public includeSalesPersons: boolean = true;
    public salesPersonUniqueNames: string[];

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.inventory = new AdvanceSearchRequestInventory();
    }

}

/**
 * AdvanceSearchRequestInventory class
 * Implements AdvanceSearchRequestInventory functionality
 */
export class AdvanceSearchRequestInventory {
    public includeInventory: false;
    public inventories: string[];
    public quantity: null;
    public includeQuantity: false;
    public quantityLessThan: false;
    public quantityEqualTo: false;
    public quantityGreaterThan: false;
    public includeItemValue: false;
    public itemValue: null;
    public itemValueLessThan: false;
    public itemValueEqualTo: false;
    public itemValueGreaterThan: false;
}
