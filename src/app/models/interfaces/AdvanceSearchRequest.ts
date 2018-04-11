import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';

export class AdvanceSearchRequest {
  public dataToSend: AdvanceSearchModel = new AdvanceSearchModel();
  public q: string = '';
  public page: number = 0;
  public count: number = 15;
  public accountUniqueName: string = '';

  get from(): string {
    if (this.dataToSend.bsRangeValue.length > 0) {
      return this.dataToSend.bsRangeValue[0];
    }
    return moment().subtract(30, 'days').format('DD-MM-YYYY');
  }

  set from(value: string) {
    if (this.dataToSend.bsRangeValue.length > 0) {
      this.dataToSend.bsRangeValue[0] = value;
    } else {
      this.dataToSend.bsRangeValue = [];
      this.dataToSend.bsRangeValue.push(value);
    }
  }

  get to(): string {
    if (this.dataToSend.bsRangeValue.length > 1) {
      return this.dataToSend.bsRangeValue[1];
    }
    return moment().format('DD-MM-YYYY');
  }

  set to(value: string) {
    if (this.dataToSend.bsRangeValue.length > 1) {
      this.dataToSend.bsRangeValue[1] = value;
    } else {
      if (this.dataToSend.bsRangeValue.length === 0) {
        this.dataToSend.bsRangeValue = [];
        this.dataToSend.bsRangeValue.push(moment(value, GIDDH_DATE_FORMAT).subtract(30, 'days').format('DD-MM-YYYY'));
      }
      this.dataToSend.bsRangeValue.push(value);
    }
  }

  public sort: string = 'asc';
  public reversePage: boolean = false;

  constructor() {
    this.dataToSend = new AdvanceSearchModel();
  }
}

export class AdvanceSearchModel {
  public bsRangeValue: string[] = [];
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

  constructor() {
    this.bsRangeValue = [];
    this.inventory = new AdvanceSearchRequestInventory();
  }

}

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
  public includeItemLessThan: false;
  public includeItemEqualTo: false;
  public includeItemGreaterThan: false;
}
