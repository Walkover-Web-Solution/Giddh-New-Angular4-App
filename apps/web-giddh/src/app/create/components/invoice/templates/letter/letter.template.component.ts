import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SalesEntryClass, VOUCHER_TYPE_LIST, VoucherClass } from '../../../../../models/api-models/Sales';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CreateHttpService } from '../../../../create-http-service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService } from '../../../../../services/toaster.service';
import * as moment from 'moment';
import { IOption } from '../../../../../theme/ng-virtual-select/sh-options.interface';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI } from '../../../../../shared/helpers/defaultDateFormat';
import { AppState } from '../../../../../store';
import { select, Store } from '@ngrx/store';
import { SelectComponent } from '../../../../../theme/ng-select/select.component';
import { GeneralActions } from '../../../../../actions/general/general.actions';
import { ICommonItemOfTransaction } from '../../../../../models/api-models/Invoice';
import { LedgerDiscountClass } from '../../../../../models/api-models/SettingsDiscount';
import { TaxControlData } from '../../../../../theme/tax-control/tax-control.component';
import { CommonActions } from '../../../../../actions/common.actions';
import { CountryRequest } from "../../../../../models/api-models/Common";

@Component({
	selector: 'letter-template',
	templateUrl: './letter.template.component.html',
	styleUrls: [
		'../template.component.scss',
		'./letter.template.component.scss'
	],
	// encapsulation: ViewEncapsulation.Native
})

export class LetterTemplateComponent implements OnInit, OnDestroy {
	public universalDate: Date;
	public quantity: number;
	public rate: number;
	public amount: number;
	public taxableValue: number;
	public total: number;
	@Output() public closeAndDestroyComponent: EventEmitter<any> = new EventEmitter();
	@ViewChild('invoicePreviewModal') public invoicePreviewModal: ModalDirective;

	public invFormData: VoucherClass;
	public isGenDtlCollapsed: boolean = false;
	public isMlngAddrCollapsed: boolean = false;
	public isOthrDtlCollapsed: boolean = false;
	public isCustDtlCollapsed: boolean = false;
	public selectedFiles: any;
	public logoPath: any;
	public data: VoucherClass;
	public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
	public name: string = 'August 09, 2017';
	public name1: string = 'GSTIN: 11AAAAAA000A1Z0';
	public name2: string = 'PAN: AAACW9768L';
	public base64Data: SafeResourceUrl = '';
	public planHtml: any;
	public css = `  <style>
  .logo-wrap {
    width: 120px;
  }
  figure {
      height: 50px;
      overflow: hidden;
    }
</style>`;

	public typeaheadNoResultsOfCustomer: boolean = false;
	public pageList: IOption[] = VOUCHER_TYPE_LIST;
	public selectedPage: string = VOUCHER_TYPE_LIST[0].value;
	public updateAccount: boolean = false;
	public dueAmount: number;
	public countrySource: IOption[] = [];
	public giddhDateFormat: string = GIDDH_DATE_FORMAT;
	public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
	public autoFillShipping: boolean = true;

	// reactive form
	public CreateInvoiceForm: FormGroup;
	public statesSource$: Observable<IOption[]> = observableOf([]);
	public isFormSubmitted: boolean = false;
	public isIndia: boolean = false;

	public countrySource$: Observable<IOption[]> = observableOf([]);

	constructor(
		private _sanitizer: DomSanitizer,
		private _createHttpService: CreateHttpService,
		private _toasty: ToasterService,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private generalAction: GeneralActions,
		private commonActions: CommonActions
	) {
		this.invFormData = new VoucherClass();
		this.setCreateInvoiceForm();
	}

	public readUrl(event: any) {
		if (event.target.files && event.target.files[0]) {
			let reader = new FileReader();
			reader.onload = (item: any) => {
				this.logoPath = item.target.result;
			};
			reader.readAsDataURL(event.target.files[0]);
		}
	}

	public clearUploadedImg() {
		this.logoPath = null;
	}

	public ngOnInit() {
		this.getCountry();
		this.data = new VoucherClass();

		this.CreateInvoiceForm.get('uiCalculation').get('depositAmount').valueChanges.subscribe((val) => {
			let data = _.cloneDeep(this.CreateInvoiceForm.value);
			let totalAmountWithTax = _.sumBy(data.entries, (entry) => isNaN(parseFloat(entry.amount)) ? 0 : parseFloat(entry.amount));
			let balanceDue = totalAmountWithTax - val;
			this.CreateInvoiceForm.get('uiCalculation').get('balanceDue').patchValue(balanceDue);
		});

	}

	public ngOnDestroy() {
		//
	}

	public emitTemplateData(data: any) {
		this.isFormSubmitted = true;
		this.isGenDtlCollapsed = false;
		this.isMlngAddrCollapsed = false;
		this.isOthrDtlCollapsed = false;
		this.isCustDtlCollapsed = false;

		if (this.CreateInvoiceForm.valid) {
			this._createHttpService.Generate(data).subscribe(response => {
				if (response.status === 'success') {
					this.base64Data = this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + response.body);
					this.invoicePreviewModal.show();
				} else if (response.status === 'error') {
					this._toasty.errorToast(response.message, response.code);
				}
			});
		} else {
			this._toasty.errorToast('Please fill are red marked fields.', 'Validation check');
		}
	}

	public doDestroy() {
		this.closeAndDestroyComponent.emit(true);
	}

	/////// Taken from Sales ////////
	public onSubmitInvoiceForm(f?: NgForm) {
		let data: any = _.cloneDeep(this.CreateInvoiceForm.value);
		data.invoiceDetails.dueDate = data.invoiceDetails.dueDate ? moment(data.invoiceDetails.dueDate).format(GIDDH_DATE_FORMAT) : '';
		data.invoiceDetails.invoiceDate = data.invoiceDetails.invoiceDate ? moment(data.invoiceDetails.invoiceDate).format(GIDDH_DATE_FORMAT) : '';
		data.other.shippingDate = data.other.shippingDate ? moment(data.other.shippingDate).format(GIDDH_DATE_FORMAT) : '';
		data.entries.forEach((entry) => {
			entry.entryDate = entry.entryDate ? moment(entry.entryDate).format(GIDDH_DATE_FORMAT) : '';
		});
		data.userDetails.billingDetails.address = data.userDetails.billingDetails.address ? [data.userDetails.billingDetails.address] : null;
		data.userDetails.shippingDetails.address = data.userDetails.shippingDetails.address ? [data.userDetails.shippingDetails.address] : null;

		data.companyDetails.address = data.companyDetails.address ? [data.companyDetails.address] : null;
		data.companyDetails.companyGstDetails.address = data.companyDetails.companyGstDetails.address ? [data.companyDetails.companyGstDetails.address] : null;

		this.emitTemplateData(data);
	}

	public convertDateForAPI(val: any): string {
		if (val) {
			try {
				return moment(val).format(GIDDH_DATE_FORMAT);
			} catch (error) {
				return '';
			}
		} else {
			return '';
		}
	}

	public resetInvoiceForm(f: NgForm) {
		f.form.reset();
		this.invFormData = new VoucherClass();
		// toggle all collapse
		this.isGenDtlCollapsed = true;
		this.isMlngAddrCollapsed = true;
		this.isOthrDtlCollapsed = true;
	}

	public addBlankRow() {
		this.calculateAndSetTotal();
		const transactionEntries = this.CreateInvoiceForm.controls['entries'] as FormArray;
		transactionEntries.push(this.returnArrayData());
	}

	public calculateAndSetTotal() {
		let data = _.cloneDeep(this.CreateInvoiceForm.value);
		let totalAmount = 0;
		data.entries.forEach((entry) => {
			totalAmount = totalAmount + (entry.quantity * entry.rate) - (entry.discount); // Amount without tax
		});

		let totalQuantity = _.sumBy(data.entries, (entry) => isNaN(parseFloat(entry.quantity)) ? 0 : parseFloat(entry.quantity));
		let totalRate = _.sumBy(data.entries, (entry) => isNaN(parseFloat(entry.rate)) ? 0 : parseFloat(entry.rate));
		let totalAmountWithTax = _.sumBy(data.entries, (entry) => isNaN(parseFloat(entry.amount)) ? 0 : parseFloat(entry.amount));
		let totalDiscount = _.sumBy(data.entries, (entry) => isNaN(parseFloat(entry.discount)) ? 0 : parseFloat(entry.discount));
		let gstTaxesTotal = _.sumBy(data.entries, (entry) => isNaN(parseFloat(entry.tax)) ? 0 : parseFloat(entry.tax));

		this.CreateInvoiceForm.get('uiCalculation').get('subTotal').patchValue(totalAmount);
		this.CreateInvoiceForm.get('uiCalculation').get('totalTaxableValue').patchValue(totalAmount);
		this.CreateInvoiceForm.get('uiCalculation').get('grandTotal').patchValue(totalAmountWithTax);
		this.CreateInvoiceForm.get('uiCalculation').get('totalDiscount').patchValue(totalDiscount);
		this.CreateInvoiceForm.get('uiCalculation').get('gstTaxesTotal').patchValue(gstTaxesTotal);
	}

	public autoFillShippingDetails() {
		// auto fill shipping address
		// this.autoFillShipping
		// this.CreateInvoiceForm.get('userDetails').get('shippingDetails').get('autoFillShipping').value
		if (this.CreateInvoiceForm.get('userDetails').get('shippingDetails').get('autoFillShipping').value) {
			let billingDetails = this.CreateInvoiceForm.get('userDetails').get('billingDetails').value;
			this.CreateInvoiceForm.get('userDetails').get('shippingDetails').patchValue(billingDetails);
			// this.invFormData.accountDetails.shippingDetails = _.cloneDeep(this.invFormData.accountDetails.billingDetails);
		}
	}

	public removeTransaction(entryIdx: number) {
		const transactionEntries = this.CreateInvoiceForm.controls['entries'] as FormArray;
		if (transactionEntries.length > 1) {
			transactionEntries.removeAt(entryIdx);
		} else {
			this._toasty.warningToast('Unable to delete a single transaction');
		}
		this.calculateAndSetTotal();
	}

	////////// Reactive form //////////////

	public returnArrayData() {
		return this.fb.group({
			entryDate: '',
			description: '',
			quantity: 0,
			rate: 0,
			discount: 0,
			tax: 0,
			amount: 0
		});
	}

	public setCreateInvoiceForm() {
		this.CreateInvoiceForm = this.fb.group({
			entries: this.fb.array([this.returnArrayData()]),
			userDetails: this.fb.group({
				countryCode: ['IN', Validators.required],
				userName: [''],
				userEmail: '',
				userMobileNumber: '',
				userCompanyName: ['', Validators.required],
				billingDetails: this.fb.group({
					gstNumber: null,
					address: null,
					stateCode: null,
					stateName: null,
					panNumber: null
				}),
				shippingDetails: this.fb.group({
					autoFillShipping: false,
					gstNumber: null,
					address: null,
					stateCode: null,
					stateName: null,
					panNumber: null
				})
			}),
			companyDetails: this.fb.group({
				name: ['', Validators.required],
				address: null,
				companyGstDetails: this.fb.group({
					gstNumber: null,
					address: null,
					stateCode: null,
					stateName: null,
					panNumber: null
				})
			}),
			signature: this.fb.group({
				slogan: null,
				ownerName: '',
				signatureImage: null
			}),
			invoiceDetails: this.fb.group({
				invoiceNumber: ['', Validators.required],
				invoiceDate: null,
				dueDate: null
			}),
			other: this.fb.group({
				senderAddress: null, // Not available in API
				note1: null,
				note2: null,
				shippingDate: null,
				shippedVia: null,
				trackingNumber: null,
				customFields: this.fb.group({
					customField1: null,
					customFieldLabel1: null,
					customField2: null,
					customFieldLabel2: null,
					customField3: null,
					customFieldLabel3: null
				})
			}),
			uiCalculation: this.fb.group({
				subTotal: 0,
				totalDiscount: 0,
				totalTaxableValue: 0,
				gstTaxesTotal: 0,
				grandTotal: 0,
				dueAmount: null,
				balanceDue: 0,
				depositAmount: 0
			})
		});
	}

	public getStateCode(type: string, statesEle: SelectComponent) {
		let allData = _.cloneDeep(this.CreateInvoiceForm.value);
		let gstVal;
		if (type === 'senderInfo') {
			gstVal = allData.companyDetails.companyGstDetails.gstNumber;
		} else {
			gstVal = allData.userDetails[type].gstNumber;
		}
		// let gstVal = _.cloneDeep(this.invFormData.accountDetails[type].gstNumber);
		if (gstVal.length >= 2) {
			this.statesSource$.pipe(take(1)).subscribe(st => {
				let s = st.find(item => item.value === gstVal.substr(0, 2));
				if (s) {
					if (type === 'senderInfo') {
						this.CreateInvoiceForm.get('companyDetails').get('companyGstDetails').get('stateCode').patchValue(s.value);
					} else {
						this.CreateInvoiceForm.get('userDetails').get(type).get('stateCode').patchValue(s.value);
					}
				} else {
					this.invFormData.accountDetails[type].stateCode = null;
					this._toasty.clearAllToaster();
					this._toasty.warningToast('Invalid GSTIN.');
				}
				statesEle.disabled = true;
			});
		} else {
			statesEle.disabled = false;
			this.invFormData.accountDetails[type].stateCode = null;
		}
	}

	public setAmount(entry: SalesEntryClass) {
		// delaying due to ngModel change
		setTimeout(() => {
			this.taxableValue = this.getTaxableValue(entry);
			let tax = this.getTotalTaxOfEntry(entry.taxes);
			this.total = this.getTransactionTotal(tax, entry);
		}, 500);
	}

	/**
	 * @param entry: SalesEntryClass object
	 * @return taxable value after calculation
	 * @scenerio one -- without stock entry -- amount - discount = taxableValue
	 * @scenerio two -- stock entry { rate*qty -(discount) = taxableValue}
	 */
	public getTaxableValue(entry: SalesEntryClass): number {
		let count: number = 0;
		if (this.quantity && this.rate) {
			this.amount = this.rate * this.quantity;
			count = this.checkForInfinity((this.rate * this.quantity) - this.getTotalDiscount(entry.discounts));
		} else {
			count = this.checkForInfinity(this.amount - this.getTotalDiscount(entry.discounts));
		}
		return count;
	}

	/**
	 * @return numeric value
	 * @param discountArr collection of discount items
	 */
	public getTotalDiscount(discountArr: LedgerDiscountClass[]) {
		let count: number = 0;
		if (discountArr.length > 0) {
			_.forEach(discountArr, (item: ICommonItemOfTransaction) => {
				count += Math.abs(item.amount);
			});
		}
		return count;
	}

	public checkForInfinity(value): number {
		return (value === Infinity) ? 0 : value;
	}

	public getTotalTaxOfEntry(taxArr: TaxControlData[]): number {
		let count: number = 0;
		if (taxArr.length > 0) {
			_.forEach(taxArr, (item: TaxControlData) => {
				count += item.amount;
			});
			return this.checkForInfinity(count);
		} else {
			return count;
		}
	}

	public getTransactionTotal(tax: number, entry: SalesEntryClass): number {
		let count: number = 0;
		if (tax > 0) {
			let a = this.getTaxableValue(entry) * (tax / 100);
			a = this.checkForInfinity(a);
			let b = _.cloneDeep(this.getTaxableValue(entry));
			count = a + b;
		} else {
			count = _.cloneDeep(this.getTaxableValue(entry));
		}
		return Number(count.toFixed(2));
	}

	public sayHello() {
		alert('Hello');
	}

	public processRateAndQuantity(indx: number) {
		const transactionEntries = this.CreateInvoiceForm.controls['entries'] as FormArray;
		let data = _.cloneDeep(transactionEntries.value);
		let selectedRow = data[indx];
		selectedRow.amount = selectedRow.quantity * selectedRow.rate;
		data[indx] = selectedRow;
		transactionEntries.patchValue(data);
		this.calculateAndSetTotal();
	}

	public processTax(indx: number) {
		const transactionEntries = this.CreateInvoiceForm.controls['entries'] as FormArray;
		let data = _.cloneDeep(transactionEntries.value);
		let selectedRow = data[indx];
		selectedRow.amount = selectedRow.quantity * selectedRow.rate;
		// selectedRow.amount = selectedRow.amount + ((selectedRow.amount * selectedRow.tax) / 100);
		data[indx] = selectedRow;
		transactionEntries.patchValue(data);
		this.calculateAndSetTotal();
	}

	public txnChangeOccurred() {
		//
	}

	public getCountry() {
		this.store.pipe(select(s => s.common.countries), takeUntil(this.destroyed$)).subscribe(res => {
			if (res) {
				Object.keys(res).forEach(key => {
					this.countrySource.push({ value: res[key].countryName, label: res[key].alpha2CountryCode + ' - ' + res[key].countryName, additional: res[key].callingCode });
				});
				this.countrySource$ = observableOf(this.countrySource);
			} else {
				let countryRequest = new CountryRequest();
				countryRequest.formName = '';
				this.store.dispatch(this.commonActions.GetCountry(countryRequest));
			}
		});
	}
}
