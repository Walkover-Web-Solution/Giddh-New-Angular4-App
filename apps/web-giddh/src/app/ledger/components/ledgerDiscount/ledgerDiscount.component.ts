import { take, takeUntil } from 'rxjs/operators';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';
import { IDiscountList, LedgerDiscountClass } from '../../../models/api-models/SettingsDiscount';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';

@Component({
	selector: 'ledger-discount',
	templateUrl: 'ledgerDiscount.component.html',
	styleUrls: [`./ledgerDiscount.component.scss`]
})

export class LedgerDiscountComponent implements OnInit, OnDestroy, OnChanges {

	public get defaultDiscount(): LedgerDiscountClass {
		return this.discountAccountsDetails[0];
	}

	@Input() public discountAccountsDetails: LedgerDiscountClass[];
	@Input() public ledgerAmount: number = 0;
	@Output() public discountTotalUpdated: EventEmitter<number> = new EventEmitter();
	@Output() public hideOtherPopups: EventEmitter<boolean> = new EventEmitter<boolean>();
	public discountTotal: number;
	public discountAccountsList$: Observable<IDiscountList[]>;
	public discountFromPer: boolean = true;
	public discountFromVal: boolean = true;
	public discountPercentageModal: number = 0;
	public discountFixedValueModal: number = 0;
	@ViewChild('disInptEle') public disInptEle: ElementRef;

	@Input() public discountMenu: boolean;
	@Input() public maskInput: string;
	@Input() public prefixInput: string;
	@Input() public suffixInput: string;
	// @HostBinding('attr.tabindex') public tabindex = '0';

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private store: Store<AppState>) {
		this.discountAccountsList$ = this.store.select(p => p.settings.discount.discountList).pipe(takeUntil(this.destroyed$));
	}

	public onFocusLastDiv(el) {
		el.stopPropagation();
		el.preventDefault();
		if (!this.discountMenu) {
			this.discountMenu = true;
			this.hideOtherPopups.emit(true);
			return;
		}
		let focussableElements = '.ledger-panel input[type=text]:not([disabled]),.ledger-panel [tabindex]:not([disabled]):not([tabindex="-1"])';
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

	public ngOnInit() {
		this.prepareDiscountList();

		if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
			this.discountFixedValueModal = this.defaultDiscount.amount;
		} else {
			this.discountPercentageModal = this.defaultDiscount.amount;
		}
		this.change();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if ('discountAccountsDetails' in changes && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue) {
			this.prepareDiscountList();

			if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
				this.discountFixedValueModal = this.defaultDiscount.amount;
			} else {
				this.discountPercentageModal = this.defaultDiscount.amount;
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
		this.discountTotal = giddhRoundOff(this.generateTotal(), 2);
		this.discountTotalUpdated.emit(this.discountTotal);
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

		let perFromAmount = ((percentageListTotal * this.ledgerAmount) / 100);
		return perFromAmount + fixedListTotal;
	}

	public trackByFn(index) {
		return index; // or item.id
	}

	public hideDiscountMenu() {
		this.discountMenu = false;
	}

	public toggleDiscountMenu() {
		this.discountMenu = !this.discountMenu;
	}

	public discountInputBlur(event) {
		if (event && event.relatedTarget && this.disInptEle && !this.disInptEle.nativeElement.contains(event.relatedTarget)) {
			this.hideDiscountMenu();
		}
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
