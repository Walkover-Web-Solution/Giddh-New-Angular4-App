import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { HIGH_RATE_FIELD_PRECISION } from '../../../app.constant';
import { LedgerDiscountClass } from '../../../models/api-models/SettingsDiscount';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { MatMenuTrigger } from '@angular/material/menu';
import { DiscountProcessingHelper } from '../../helpers/discount-processing.helper';

@Component({
    selector: 'ledger-discount',
    templateUrl: 'ledger-discount.component.html',
    styleUrls: ['./ledger-discount.component.scss'],
    standalone: false
})

export class LedgerDiscountComponent implements OnInit, OnDestroy, OnChanges {

    public get defaultDiscount(): LedgerDiscountClass {
        return this.discountAccountsDetails[0];
    }

    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public discountAccountsDetails: LedgerDiscountClass[];
    @Input() public ledgerAmount: number = 0;
    @Output() public discountTotalUpdated: EventEmitter<{ discountTotal: number, isActive: any, discount: any }> = new EventEmitter();
    public discountTotal: number;
    public discountFromPer: boolean = true;
    public discountFromVal: boolean = true;
    public discountPercentageModal: number = 0;
    public discountFixedValueModal: number = 0;
    @ViewChild('disInptEle', { static: true }) public disInptEle: ElementRef;
    /** Holds mat menu reference */
    @ViewChild(MatMenuTrigger) discountMenu: MatMenuTrigger;
    @Input() public maskInput: string;
    @Input() public prefixInput: string;
    @Input() public suffixInput: string;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** List of discounts */
    @Input() private discountsList: any[] = [];
    @Input() public giddhBalanceDecimalPlaces: number = 2;
    /* Amount should have precision up to 16 digits for better calculation */
    public highPrecisionRate = HIGH_RATE_FIELD_PRECISION;
    /** True if field is readonly */
    @Input() public readonly: boolean = false;
    /** Emitter for create new discount */
    @Output() public createNewDiscount: EventEmitter<boolean> = new EventEmitter<boolean>();

    public onFocusLastDiv(el) {
        el.stopPropagation();
        el.preventDefault();
        let focussableElements = '.ledger-panel input[type=text]:not([disabled]),.ledger-panel [tabindex]:not([disabled]):not([tabindex="-1"])';
        let focussable = Array.prototype.filter.call(document.querySelectorAll(focussableElements),
            (element) => {
                // check for visibility while always include the current activeElement
                return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
            });
        let index = focussable?.indexOf(document.activeElement);
        if (index > -1) {
            let nextElement = focussable[index + 1] || focussable[0];
            nextElement.focus();
        }
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
        if ('discountAccountsDetails' in changes && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue || changes.ledgerAmount) {
            this.prepareDiscountList();

            if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
                this.discountFixedValueModal = this.defaultDiscount.amount;
            } else {
                this.discountPercentageModal = this.defaultDiscount.amount;
            }
            this.change();
        }
        if ('discountsList' in changes && changes.discountsList.currentValue !== changes.discountsList.previousValue) {
            this.prepareDiscountList();
        }
    }

    /**
     * Prepare discount obj
     *
     * @memberof LedgerDiscountComponent
     */
    public prepareDiscountList(): void {
        if (this.discountsList?.length > 0) {
            this.processDiscountList();
        }
    }

    /**
     * This will process discount list
     *
     * @private
     * @memberof LedgerDiscountComponent
     */
    private processDiscountList(): void {
        this.discountAccountsDetails = DiscountProcessingHelper.processDiscountList(
            this.discountsList,
            this.discountAccountsDetails
        );
    }

    public discountFromInput(type: 'FIX_AMOUNT' | 'PERCENTAGE', val: string) {
        this.defaultDiscount.amount = parseFloat(String(val)?.replace(/,/g, ''));
        this.defaultDiscount.discountValue = parseFloat(String(val)?.replace(/,/g, ''));
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
     *
     * @param {*} [event] Change event
     * @param {*} [discount] Discount value
     * @param {boolean} [preventEmit] Prevent the total amount update event to avoid recursive calculation
     * @memberof LedgerDiscountComponent
     */
    public change(event?: any, discount?: any, preventEmit?: boolean) {
        this.discountTotal = giddhRoundOff(this.generateTotal(), this.giddhBalanceDecimalPlaces);
        if (!preventEmit) {
            /** Should emit only conditionally, done to avoid
             * recursive call to change method in case of inclusive tax calculation for stock
            */
            this.discountTotalUpdated.emit({ discountTotal: this.discountTotal, isActive: event, discount: discount });
        }
    }

    /**
     * generate total of discount amount
     * @returns {number}
     */
    public generateTotal(): number {
        if (this.discountAccountsDetails && this.discountAccountsDetails[0]) {
            if (this.discountAccountsDetails[0].amount) {
                this.discountAccountsDetails[0].isActive = true;
            } else {
                this.discountAccountsDetails[0].isActive = false;
            }
        }

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

        let perFromAmount = ((percentageListTotal * this.ledgerAmount) / 100);
        return perFromAmount + fixedListTotal;
    }

    public trackByFn(index) {
        return index;
    }

    /**
    * Toggle discount menu
    *
    * @param {boolean} [isOpen=false]
    * @memberof LedgerDiscountComponent
    */
    public toggleDiscountMenu(isOpen: boolean = false) {
        if (isOpen) {
            !this.discountMenu.menuOpen && this.discountMenu?.openMenu();
        } else {
            this.discountMenu.menuOpen && this.discountMenu?.closeMenu();
        }
    }

    /**
     * Emits create new discount event
     *
     * @memberof LedgerDiscountComponent
     */
    public createNew(): void {
        this.createNewDiscount.emit();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
