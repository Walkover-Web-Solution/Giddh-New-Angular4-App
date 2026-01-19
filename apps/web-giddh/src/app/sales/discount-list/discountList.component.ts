import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DiscountProcessingHelper } from '../../ledger/helpers/discount-processing.helper';
import { LedgerDiscountClass } from '../../models/api-models/SettingsDiscount';
import { SettingsDiscountService } from '../../services/settings.discount.service';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'discount-list',
    templateUrl: 'discountList.component.html',
    styleUrls: ['./discountList.component.scss'],
    standalone:false
})

/**
 * DiscountListComponent component
 * Handles discountlist functionality and user interactions
 */
export class DiscountListComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public isMenuOpen: boolean = false;
    @Output() public selectedDiscountItems: EventEmitter<any[]> = new EventEmitter();
    @Output() public selectedDiscountItemsTotal: EventEmitter<number> = new EventEmitter();
    @ViewChild('disInptEle', { static: true }) public disInptEle: ElementRef;

    // new code
    @Input() public discountSum: number;
    @Input() public discountAccountsDetails: LedgerDiscountClass[];
    @Input() public totalAmount: number = 0;
    @Output() public discountTotalUpdated: EventEmitter<number> = new EventEmitter();
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private settingsDiscountService: SettingsDiscountService
    ) {

    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.prepareDiscountList();

        /**
         * Handles if functionality
         */
        if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
            this.discountFixedValueModal = this.defaultDiscount.amount;
        } else {
            this.discountPercentageModal = this.defaultDiscount.amount;
        }
    }

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(changes: SimpleChanges): void {
        /**
         * Handles if functionality
         */
        if ('discountAccountsDetails' in changes && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue) {
            this.prepareDiscountList();

            /**
             * Handles if functionality
             */
            if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
                this.discountFixedValueModal = this.defaultDiscount.amount;
            } else {
                this.discountPercentageModal = this.defaultDiscount.amount;
            }
        }

        /**
         * Handles if functionality
         */
        if ('totalAmount' in changes && changes.totalAmount.currentValue !== changes.totalAmount.previousValue) {
            this.change();
        }
    }

    /**
     * Handles discountInputBlur functionality
     */
    public discountInputBlur(event) {
        /**
         * Handles if functionality
         */
        if (event && event.relatedTarget && this.disInptEle && !this.disInptEle?.nativeElement.contains(event.relatedTarget)) {
            this.hideDiscountMenu();
        }
    }

    /**
     * prepare discount obj
     */
    public prepareDiscountList() {
        /**
         * Handles if functionality
         */
        if (this.discountsList?.length > 0) {
            this.processDiscountList();
        } else {
            /**
             * Handles if functionality
             */
            if (this.getDiscountsLoading) {
                return;
            }
            this.getDiscountsLoading = true;
            this.settingsDiscountService.GetDiscounts().pipe(takeUntil(this.destroyed$)).subscribe(response => {
                /**
                 * Handles if functionality
                 */
                if (response?.status === "success" && response?.body?.length > 0) {
                    this.discountsList = response?.body;
                    this.processDiscountList();
                }
                this.getDiscountsLoading = false;
            });
        }
    }

    /**
     * Handles processDiscountList functionality
     */
    private processDiscountList(): void {
        this.discountAccountsDetails = DiscountProcessingHelper.processDiscountList(
            this.discountsList,
            this.discountAccountsDetails
        );
    }

    /**
     * Handles discountFromInput functionality
     */
    public discountFromInput(type: 'FIX_AMOUNT' | 'PERCENTAGE', val: string) {
        this.defaultDiscount.amount = parseFloat(val);
        this.defaultDiscount.discountValue = parseFloat(val);
        this.defaultDiscount.discountType = type;

        this.change();

        /**
         * Handles if functionality
         */
        if (!val) {
            this.discountFromVal = true;
            this.discountFromPer = true;
            return;
        }
        /**
         * Handles if functionality
         */
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
        let percentageListTotal = this.discountAccountsDetails?.filter(f => f.isActive)
            .filter(s => s.discountType === 'PERCENTAGE')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let fixedListTotal = this.discountAccountsDetails?.filter(f => f.isActive)
            .filter(s => s.discountType === 'FIX_AMOUNT')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let perFromAmount = ((percentageListTotal * this.totalAmount) / 100);
        return perFromAmount + fixedListTotal;
    }

    /**
     * Handles trackByFn functionality
     */
    public trackByFn(index) {
        return index;
    }

    /**
     * Hides discountmenu element
     */
    public hideDiscountMenu() {
        this.isMenuOpen = false;
    }

    /**
     * Toggles discountmenu state
     */
    public toggleDiscountMenu() {
        this.isMenuOpen = (!this.isMenuOpen);
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
