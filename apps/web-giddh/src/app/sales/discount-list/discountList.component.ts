import { Observable, ReplaySubject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ElementViewContainerRef } from 'apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ModalDirective } from 'ngx-bootstrap';
import { IDiscountList, LedgerDiscountClass } from '../../models/api-models/SettingsDiscount';

@Component({
	selector: 'discount-list',
	templateUrl: 'discountList.component.html',
	styles: [`
      .dropdown-menu > li > a.btn-link {
          color: #10aae0;
      }

      :host .dropdown-menu {
          overflow: auto;
      }


      .dropdown-menu {
          right: -110px;
          left: auto;
          top: 8px;
      }

      td {
          vertical-align: middle !important;
      }
      .customItem {
      padding-top: 5px;

      }

      .customItem:hover {
          background-color:#e3e4ed !important;
      }

      .customItem {
          padding: 5px;

      }

      .customItem:hover span {
          color:#5B64C9 !important;
      }

      // .multi-select input.form-control {
      //     background-image: unset !important;
      // }

      .multi-select .caret {
          display: block !important;
      }

      .multi-select.adjust .caret {
          right: -2px !important;
          top: 14px !important;
      }

      :host {
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
      }
  `]
})

export class DiscountListComponent implements OnInit, OnChanges, OnDestroy {

	@Input() public isMenuOpen: boolean = false;
	@Output() public selectedDiscountItems: EventEmitter<any[]> = new EventEmitter();
	@Output() public selectedDiscountItemsTotal: EventEmitter<number> = new EventEmitter();
	@ViewChild('quickAccountComponent') public quickAccountComponent: ElementViewContainerRef;
	@ViewChild('quickAccountModal') public quickAccountModal: ModalDirective;
	@ViewChild('disInptEle') public disInptEle: ElementRef;

	// new code
	@Input() public discountSum: number;
	@Input() public discountAccountsDetails: LedgerDiscountClass[];
	@Input() public totalAmount: number = 0;
	@Output() public discountTotalUpdated: EventEmitter<number> = new EventEmitter();
	public discountAccountsList$: Observable<IDiscountList[]>;
	public discountFromPer: boolean = true;
	public discountFromVal: boolean = true;
	public discountPercentageModal: number = 0;
	public discountFixedValueModal: number = 0;

	public get defaultDiscount(): LedgerDiscountClass {
		return this.discountAccountsDetails[0];
	}

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private store: Store<AppState>
	) {
		this.discountAccountsList$ = this.store.pipe(select(p => p.settings.discount.discountList), takeUntil(this.destroyed$));
		this.discountAccountsList$.subscribe(data => {
			if (data && data.length) {
				this.prepareDiscountList();
			}
		});
	}

	public ngOnInit() {
		if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
			this.discountFixedValueModal = this.defaultDiscount.amount;
		} else {
			this.discountPercentageModal = this.defaultDiscount.amount;
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if ('discountAccountsDetails' in changes && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue) {
			this.prepareDiscountList();

			if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
				this.discountFixedValueModal = this.defaultDiscount.amount;
			} else {
				this.discountPercentageModal = this.defaultDiscount.amount;
			}
			// this.change();
		}

		if ('totalAmount' in changes && changes.totalAmount.currentValue !== changes.totalAmount.previousValue) {
			this.change();
		}
	}

	public discountInputBlur(event) {
		if (event && event.relatedTarget && this.disInptEle && !this.disInptEle.nativeElement.contains(event.relatedTarget)) {
			this.hideDiscountMenu();
		}
	}

	/**
	 * prepare discount obj
	 */
	public prepareDiscountList() {
		let discountAccountsList: IDiscountList[] = [];
		this.discountAccountsList$.pipe(take(1)).subscribe(d => discountAccountsList = d);
		if (discountAccountsList.length && this.discountAccountsDetails && this.discountAccountsDetails.length) {
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
		this.discountTotalUpdated.emit();
	}

	/**
	 * generate total of discount amount
	 * @returns {number}
	 */
	public generateTotal() {
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

		let perFromAmount = ((percentageListTotal * this.totalAmount) / 100);
		return perFromAmount + fixedListTotal;
	}

	public trackByFn(index) {
		return index; // or item.id
	}

	public hideDiscountMenu() {
		this.isMenuOpen = false;
	}

	public toggleDiscountMenu() {
		this.isMenuOpen = (!this.isMenuOpen);
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
