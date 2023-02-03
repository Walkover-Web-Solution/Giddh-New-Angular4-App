import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
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
    @Output() public discountTotalUpdated: EventEmitter<{ discountTotal: number, isActive: any, discount: any }> = new EventEmitter();
    @Output() public hideOtherPopups: EventEmitter<boolean> = new EventEmitter<boolean>();
    public discountTotal: number;
    public discountFromPer: boolean = true;
    public discountFromVal: boolean = true;
    public discountPercentageModal: number = 0;
    public discountFixedValueModal: number = 0;
    @ViewChild('disInptEle', { static: true }) public disInptEle: ElementRef;

    @Input() public discountMenu: boolean;
    @Input() public maskInput: string;
    @Input() public prefixInput: string;
    @Input() public suffixInput: string;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** List of discounts */
    @Input() private discountsList: any[] = [];

    constructor(

    ) {

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
        if ('discountAccountsDetails' in changes && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue || changes.ledgerAmount) {
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
     */
    public change(event?: any, discount?: any) {
        this.discountTotal = giddhRoundOff(this.generateTotal(), 2);
        this.discountTotalUpdated.emit({ discountTotal: this.discountTotal, isActive: event, discount: discount });
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
