import * as moment from 'moment/moment';

export class AdvanceSearchRequest {
	public dataToSend: AdvanceSearchModel = new AdvanceSearchModel();
	public q: string = '';
	public page: number = 0;
	public count: number = 30;
	public accountUniqueName: string = '';
	public sort: string = 'asc';

	// set from(value: string) {
	//   if (this.dataToSend.bsRangeValue.length > 0) {
	//     this.dataToSend.bsRangeValue[0] = moment(value, 'DD-MM-YYYY').toDate();
	//   } else {
	//     this.dataToSend.bsRangeValue = [];
	//     this.dataToSend.bsRangeValue.push(moment(value, 'DD-MM-YYYY').toDate());
	//   }
	// }
	public reversePage: boolean = false;

	// set to(value: string) {
	//   if (this.dataToSend.bsRangeValue.length > 1) {
	//     this.dataToSend.bsRangeValue[1] = moment(value, 'DD-MM-YYYY').toDate();
	//   } else {
	//     if (this.dataToSend.bsRangeValue.length === 0) {
	//       this.dataToSend.bsRangeValue = [];
	//       this.dataToSend.bsRangeValue.push(moment(value, GIDDH_DATE_FORMAT).subtract(30, 'days').toDate());
	//     }
	//     this.dataToSend.bsRangeValue.push(moment(value, 'DD-MM-YYYY').toDate());
	//   }
	// }

	constructor() {
		this.dataToSend = new AdvanceSearchModel();
	}

	get from(): string {
		if (this.dataToSend.bsRangeValue && this.dataToSend.bsRangeValue.length > 0) {
			return moment(this.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY');
		}
		return moment().subtract(30, 'days').format('DD-MM-YYYY');
	}

	get to(): string {
		if (this.dataToSend.bsRangeValue && this.dataToSend.bsRangeValue.length > 1) {
			return moment(this.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY');
		}
		return moment().format('DD-MM-YYYY');
	}

	set to(val) {
		if (val) {
			this.dataToSend.bsRangeValue[1] = val;
		}
	}
}

export class AdvanceSearchModel {
	// [moment().subtract(30, 'days').toDate(), moment().toDate()]
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

	constructor() {
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
