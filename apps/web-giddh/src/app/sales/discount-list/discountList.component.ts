import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ElementViewContainerRef } from 'apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LedgerDiscountClass } from '../../models/api-models/SettingsDiscount';
import { SettingsDiscountService } from '../../services/settings.discount.service';

@Component({
    selector: 'discount-list',
    templateUrl: 'discountList.component.html',
    styleUrls: ['./discountList.component.scss']
})

export class DiscountListComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public isMenuOpen: boolean = false;
    @Output() public selectedDiscountItems: EventEmitter<any[]> = new EventEmitter();
    @Output() public selectedDiscountItemsTotal: EventEmitter<number> = new EventEmitter();
    @ViewChild('quickAccountComponent', { static: true }) public quickAccountComponent: ElementViewContainerRef;
    @ViewChild('quickAccountModal', { static: true }) public quickAccountModal: ModalDirective;
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

    constructor(
        private settingsDiscountService: SettingsDiscountService
    ) {
        
    }

    public ngOnInit() {
        this.prepareDiscountList();

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
        }

        if ('totalAmount' in changes && changes.totalAmount.currentValue !== changes.totalAmount.previousValue) {
            this.change();
        }
    }

    public discountInputBlur(event) {
        if (event && event.relatedTarget && this.disInptEle && !this.disInptEle?.nativeElement.contains(event.relatedTarget)) {
            this.hideDiscountMenu();
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
     * @memberof DiscountListComponent
     */
    private processDiscountList(): void {
        this.discountsList.forEach(acc => {
            if (this.discountAccountsDetails) {
                let hasItem = this.discountAccountsDetails.some(s => s.discountUniqueName === acc.uniqueName);
                if (!hasItem) {
                    let obj: LedgerDiscountClass = new LedgerDiscountClass();
                    obj.amount = acc.discountValue;
                    obj.discountValue = acc.discountValue;
                    obj.discountType = acc.discountType;
                    obj.isActive = false;
                    obj.particular = acc.linkAccount?.uniqueName;
                    obj.discountUniqueName = acc.uniqueName;
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

    public trackByFn(index) {
        return index;
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
