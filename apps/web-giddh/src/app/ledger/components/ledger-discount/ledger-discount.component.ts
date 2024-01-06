import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { HIGH_RATE_FIELD_PRECISION } from '../../../app.constant';
import { LedgerDiscountClass } from '../../../models/api-models/SettingsDiscount';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';

@Component({
    selector: 'ledger-discount',
    templateUrl: 'ledger-discount.component.html',
    styleUrls: [`./ledger-discount.component.scss`]
})

export class LedgerDiscountComponent implements OnInit, OnDestroy, OnChanges {

    public get defaultDiscount(): LedgerDiscountClass {
        return this.discountAccountsDetails[0];
    }

    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public discountAccountsDetails: LedgerDiscountClass[];
    @Input() public ledgerAmount: number = 0;
    /* This will emit discount total updated */
    @Output() public discountTotalUpdated: EventEmitter<{ discount: any, isActive: boolean, discountType?: any, isFirstChange?: boolean }> = new EventEmitter();
    @Output() public hideOtherPopups: EventEmitter<boolean> = new EventEmitter<boolean>();
    public discountTotal: number;
    public discountFromPer: boolean = true;
    public discountFromVal: boolean = true;
    @ViewChild('disInptEle', { static: true }) public disInptEle: ElementRef;

    @Input() public discountMenu: boolean;
    @Input() public maskInput: string;
    @Input() public prefixInput: string;
    @Input() public suffixInput: string;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** List of discounts */
    @Input() private discountsList: any[] = [];
    @Input() public giddhBalanceDecimalPlaces: number = 2;
    /* Amount should have precision up to 16 digits for better calculation */
    public highPrecisionRate = HIGH_RATE_FIELD_PRECISION;
    /* This will hold discount percentage value */
    @Input() public discountPercentageModal: number = 0;
    /* This will hold discount fixed value */
    @Input() public discountFixedValueModal: number = 0;

    public onFocusLastDiv(el) {
        el.stopPropagation();
        el.preventDefault();
        if (!this.discountMenu) {
            this.discountMenu = true;
            this.hideOtherPopups.emit(true);
            return;
        }
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
            if (this.defaultDiscount && this.defaultDiscount.discountType === 'FIX_AMOUNT') {
                this.discountFixedValueModal = this.defaultDiscount.amount;
            } else {
                this.discountPercentageModal = (this.defaultDiscount) ? this.defaultDiscount.amount : 0;
            }
            if ('totalAmount' in changes && changes.totalAmount.currentValue !== changes.totalAmount.previousValue) {
                this.change();
            }
        }
        if ('discountFixedValueModal' in changes && changes.discountFixedValueModal.currentValue && changes.discountFixedValueModal.currentValue !== changes.discountFixedValueModal.previousValue) {
            this.discountFixedValueModal = changes.discountFixedValueModal.currentValue;
            this.assignDiscount('FIX_AMOUNT', changes.discountFixedValueModal.currentValue, changes.discountFixedValueModal.firstChange, true);
        }
        if ('discountPercentageModal' in changes && changes.discountPercentageModal.currentValue && changes.discountPercentageModal.currentValue !== changes.discountPercentageModal.previousValue) {
            this.discountPercentageModal = changes.discountPercentageModal.currentValue;
            this.assignDiscount('PERCENTAGE', changes.discountPercentageModal.currentValue, changes.discountPercentageModal.firstChange, true);
        }
    }

    public assignDiscount(type: any, value: any, isFirstChange: boolean = false, isActive?: boolean): void {
        this.defaultDiscount.amount = parseFloat(String(value)?.replace(/[,'\s]/g, ''));
        this.defaultDiscount.discountValue = parseFloat(String(value)?.replace(/[,'\s]/g, ''));
        this.defaultDiscount.discountType = type;

        this.discountTotalUpdated.emit({ discount: this.defaultDiscount.amount, isActive: isActive, discountType: type, isFirstChange: isFirstChange });

        if (!value) {
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
     * prepare discount obj
     */
     public prepareDiscountList() {
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
        this.discountsList?.forEach(acc => {
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

    public discountFromInput(type: 'FIX_AMOUNT' | 'PERCENTAGE', event: any) {
        this.assignDiscount(type, event.target?.value, false, true);
    }

    /**
     * on change of discount amount
     *
     * @param {*} [event] Change event
     * @param {*} [discount] Discount value
     * @param {boolean} [preventEmit] Prevent the total amount update event to avoid recursive calculation
     * @memberof LedgerDiscountComponent
     */
    public change(discount?: any, event?: boolean, preventEmit?: boolean) {

        this.discountTotal = giddhRoundOff(this.generateTotal(), this.giddhBalanceDecimalPlaces);
        if (!preventEmit) {
            /** Should emit only conditionally, done to avoid
             * recursive call to change method in case of inclusive tax calculation for stock
            */
            this.discountTotalUpdated.emit({ discount: discount, isActive: event });
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

    public hideDiscountMenu() {
        this.discountMenu = false;
    }

    public toggleDiscountMenu() {
        this.discountMenu = !this.discountMenu;
    }

    public discountInputBlur(event) {
        if (event && event.relatedTarget && this.disInptEle && !this.disInptEle?.nativeElement.contains(event.relatedTarget)) {
            this.hideDiscountMenu();
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
