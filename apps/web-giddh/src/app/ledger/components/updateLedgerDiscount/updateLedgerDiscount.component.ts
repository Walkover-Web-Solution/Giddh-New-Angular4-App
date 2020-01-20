import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';
import { INameUniqueName } from '../../../models/api-models/Inventory';
import { IDiscountList, LedgerDiscountClass } from '../../../models/api-models/SettingsDiscount';

export class UpdateLedgerDiscountData {
	public particular: INameUniqueName = { name: '', uniqueName: '' };
	public amount: number = 0;
}

@Component({
	selector: 'update-ledger-discount',
	templateUrl: 'updateLedgerDiscount.component.html',
	styleUrls: ['./updateLedgerDiscount.component.scss']
})

export class UpdateLedgerDiscountComponent implements OnInit, OnChanges, OnDestroy {
	@Input() public discountAccountsDetails: LedgerDiscountClass[];
	@Input() public ledgerAmount: number = 0;
	@Output() public discountTotalUpdated: EventEmitter<number> = new EventEmitter();
	@Output() public hideOtherPopups: EventEmitter<boolean> = new EventEmitter<boolean>();

	@Input() public discountMenu: boolean;
	@Input() public maskInput: string;
	@Input() public prefixInput: string;
	@Input() public suffixInput: string;

	public discountTotal: number;
	public discountAccountsList$: Observable<IDiscountList[]>;
	public appliedDiscount: UpdateLedgerDiscountData[] = [];
	public discountFromPer: boolean = true;
	public discountFromVal: boolean = true;
	public discountPercentageModal: number = 0;
	public discountFixedValueModal: number = 0;

	public get defaultDiscount(): LedgerDiscountClass {
		return this.discountAccountsDetails[0];
	}

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private store: Store<AppState>) {
		this.discountAccountsList$ = this.store.select(p => p.settings.discount.discountList).pipe(takeUntil(this.destroyed$));
	}

	public ngOnInit() {
		this.prepareDiscountList();
		this.change();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if ('discountAccountsDetails' in changes && !changes.discountAccountsDetails.firstChange && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue) {
			this.prepareDiscountList();

			/* check if !this.defaultDiscount.discountUniqueName so it's means
			  that this is default discount and we have added it manually not
			 from server side */
			if (this.defaultDiscount && !this.defaultDiscount.discountUniqueName) {
				if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
					this.discountFixedValueModal = this.defaultDiscount.discountValue;
					this.discountFromPer = false;
					this.discountFromVal = true;
				} else {
					this.discountPercentageModal = this.defaultDiscount.discountValue;
					this.discountFromVal = false;
					this.discountFromPer = true;
				}
			}
			this.change();
		}
	}

	/**
	 * prepare discount obj
	 */
	public prepareDiscountList() {
		let discountAccountsList: IDiscountList[] = [];
		this.discountAccountsList$.pipe(take(1)).subscribe(d => discountAccountsList = d);
		if (discountAccountsList.length) {
			discountAccountsList.forEach(acc => {
				let hasItem = this.discountAccountsDetails.some(s => s.discountUniqueName === acc.uniqueName);
				if (!hasItem) {
					let obj: LedgerDiscountClass = new LedgerDiscountClass();
					obj.amount = acc.discountValue;
					obj.discountValue = acc.discountValue;
					obj.discountType = acc.discountType;
					obj.isActive = false;
					obj.particular = acc.linkAccount.uniqueName;
					obj.discountUniqueName = acc.uniqueName;
					obj.name = acc.name;
					this.discountAccountsDetails.push(obj);
				}
			});
		}
	}

	public discountFromInput(type: 'FIX_AMOUNT' | 'PERCENTAGE', val: string) {
		this.defaultDiscount.amount = parseFloat(val);
		this.defaultDiscount.discountValue = parseFloat(val);
		this.defaultDiscount.discountType = type;

		this.change();

		if (!val) {
			this.discountFromVal = true;
			this.discountFromPer = true;
			return;
		}
		if (type === 'PERCENTAGE') {
			this.discountFromPer = true;
			this.discountFromVal = false;
		} else {
			this.discountFromPer = false;
			this.discountFromVal = true;
		}
	}

	/**
	 * on change of discount amount
	 */
	public change() {
		this.discountTotal = Number(this.generateTotal() || 0);
		this.discountTotalUpdated.emit(this.discountTotal);
		// this.appliedDiscount = this.generateAppliedDiscounts();
		// this.appliedDiscountEvent.emit(this.appliedDiscount);
	}

	/**
	 * generate total of discount amount
	 * @returns {number}
	 */
	public generateTotal(): number {
		let percentageListTotal = this.discountAccountsDetails.filter(f => f.isActive)
			.filter(s => s.discountType === 'PERCENTAGE')
			.reduce((pv, cv) => {
				return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
			}, 0) || 0;

		let fixedListTotal = this.discountAccountsDetails.filter(f => f.isActive)
			.filter(s => s.discountType === 'FIX_AMOUNT')
			.reduce((pv, cv) => {
				return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
			}, 0) || 0;

		let perFromAmount = Math.round(((percentageListTotal * (this.ledgerAmount || 0)) / 100) * 100) / 100;
		return perFromAmount + Math.round(fixedListTotal * 100) / 100;

		// return this.discountAccountsDetails.map(ds => {
		//   ds.amount = Number(ds.amount);
		//   return ds;
		// }).reduce((pv, cv) => {
		//   return Number(cv.amount) ? Number(pv) + Number(cv.amount) : Number(pv);
		// }, 0) || 0;
	}

	// public generateAppliedDiscounts(): UpdateLedgerDiscountData[] {
	//   return this.discountAccountsDetails.map(p => {
	//     let discountObj = new UpdateLedgerDiscountData();
	//     discountObj.particular.name = p.name;
	//     discountObj.particular.uniqueName = p.particular;
	//     discountObj.amount = p.amount;
	//     return discountObj;
	//   });
	// }

	public trackByFn(index) {
		return index; // or item.id
	}

	public hideDiscountMenu() {
		this.discountMenu = false;
	}

	public onFocusLastDiv(el) {
		el.stopPropagation();
		el.preventDefault();
		if (!this.discountMenu) {
			this.discountMenu = true;
			this.hideOtherPopups.emit(true);
			return;
		}
		let focussableElements = '.entrypanel input[type=text]:not([disabled]),.entrypanel [tabindex]:not([disabled]):not([tabindex="-1"])';
		// if (document.activeElement && document.activeElement.form) {
		let focussable = Array.prototype.filter.call(document.querySelectorAll(focussableElements),
			(element) => {
				// check for visibility while always include the current activeElement
				return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
			});
		let index = focussable.indexOf(document.activeElement);
		if (index > -1) {
			let nextElement = focussable[index + 1] || focussable[0];
			nextElement.focus();
		}
		this.hideDiscountMenu();
		return false;
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
