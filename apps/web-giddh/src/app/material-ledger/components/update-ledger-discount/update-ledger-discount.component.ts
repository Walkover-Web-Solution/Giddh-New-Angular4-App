import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';
import { INameUniqueName } from '../../../models/api-models/Inventory';
import { IDiscountList, LedgerDiscountClass } from '../../../models/api-models/SettingsDiscount';
import { SettingsDiscountService } from '../../../services/settings.discount.service';

export class UpdateLedgerDiscountData {
    public particular: INameUniqueName = { name: '', uniqueName: '' };
    public amount: number = 0;
}

@Component({
    selector: 'update-ledger-discount',
    templateUrl: 'update-ledger-discount.component.html',
    styleUrls: ['./update-ledger-discount.component.scss']
})

export class UpdateLedgerDiscountComponent implements OnInit, OnChanges, OnDestroy {
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public discountAccountsDetails: LedgerDiscountClass[];
    @Input() public ledgerAmount: number = 0;
    @Output() public discountTotalUpdated: EventEmitter<number> = new EventEmitter();
    @Output() public hideOtherPopups: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input() public discountMenu: boolean;
    @Input() public maskInput: string;
    @Input() public prefixInput: string;
    @Input() public suffixInput: string;
    /** True if discount menu should not open */
    @Input() public disabled: boolean = false;
    public discountTotal: number;
    public appliedDiscount: UpdateLedgerDiscountData[] = [];
    public discountFromPer: boolean = true;
    public discountFromVal: boolean = true;
    public discountPercentageModal: number = 0;
    public discountFixedValueModal: number = 0;

    public get defaultDiscount(): LedgerDiscountClass {
        return this.discountAccountsDetails[0];
    }

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** List of discounts */	
    private discountsList: any[] = [];	
    /** True if get discounts list api call in progress */	
    private getDiscountsLoading: boolean = false;

    constructor(	
        private settingsDiscountService: SettingsDiscountService	
    ) {	
        	
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
                if (!Number(this.defaultDiscount.discountValue)) {
                    this.discountFromVal = true;
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
        if (this.discountsList?.length > 0) {
            this.processDiscountList();
        } else {
            if (this.getDiscountsLoading) {
                return;
            }
            this.getDiscountsLoading = true;
            this.settingsDiscountService.GetDiscounts().pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success" && response?.body?.length > 0) {
                    this.discountsList = response?.body;
                    this.processDiscountList();
                }
                this.getDiscountsLoading = false;
            });
        }
    }

    /**
     * This will process discount list
     *
     * @private
     * @memberof UpdateLedgerDiscountComponent
     */
    private processDiscountList(): void {
        this.discountsList.forEach(acc => {
            if (this.discountAccountsDetails) {
                let hasItem = this.discountAccountsDetails.some(s => s.discountUniqueName === acc?.uniqueName);
                if (!hasItem) {
                    let obj: LedgerDiscountClass = new LedgerDiscountClass();
                    obj.amount = acc.discountValue;
                    obj.discountValue = acc.discountValue;
                    obj.discountType = acc.discountType;
                    obj.isActive = false;
                    obj.particular = acc.linkAccount?.uniqueName;
                    obj.discountUniqueName = acc?.uniqueName;
                    obj.name = acc.name;
                    this.discountAccountsDetails.push(obj);
                }
            } else {
                this.discountAccountsDetails = [];
            }
        });
    }

    public discountFromInput(type: 'FIX_AMOUNT' | 'PERCENTAGE', val: string) {
        this.defaultDiscount.amount = parseFloat(val);
        this.defaultDiscount.discountValue = parseFloat(val);
        this.defaultDiscount.discountType = type;

        this.change();
        if (type === 'PERCENTAGE') {
            this.discountFromPer = true;
            this.discountFromVal = false;
        } else {
            this.discountFromPer = false;
            this.discountFromVal = true;
        }
        if (!Number(val)) {
            this.discountFromVal = true;
            this.discountFromPer = true;
            return;
        }
    }

    /**
     * on change of discount amount
     */
    public change() {
        this.discountTotal = Number(this.generateTotal() || 0);
        this.discountTotalUpdated.emit(this.discountTotal);
    }

    /**
     * generate total of discount amount
     * @returns {number}
     */
    public generateTotal(): number {
        let percentageListTotal = this.discountAccountsDetails?.filter(f => f.isActive)
            ?.filter(s => s.discountType === 'PERCENTAGE')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let fixedListTotal = this.discountAccountsDetails?.filter(f => f.isActive)
            ?.filter(s => s.discountType === 'FIX_AMOUNT')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let perFromAmount = Math.round(((percentageListTotal * (this.ledgerAmount || 0)) / 100) * 100) / 100;
        return perFromAmount + Math.round(fixedListTotal * 100) / 100;
    }

    public trackByFn(index) {
        return index;
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
