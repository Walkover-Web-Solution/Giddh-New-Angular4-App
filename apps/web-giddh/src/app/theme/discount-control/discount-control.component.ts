import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LedgerDiscountClass } from '../../models/api-models/SettingsDiscount';
import { ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil } from 'rxjs/operators';
import { SettingsDiscountService } from '../../services/settings.discount.service';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: 'discount-control-component',
    templateUrl: './discount-control-component.html',
    styleUrls: ['./discount-control-component.scss']
})

export class DiscountControlComponent implements OnInit, OnDestroy, OnChanges {

    public get defaultDiscount(): LedgerDiscountClass {
        return this.discountAccountsDetails[0];
    }

    @Input() public discountAccountsDetails: LedgerDiscountClass[];
    @Input() public ledgerAmount: number = 0;
    @Input() public totalAmount: number = 0;
    @Input() public showHeaderText: boolean = true;
    @Output() public discountTotalUpdated: EventEmitter<{ discount: any, isActive: boolean }> = new EventEmitter();
    @Output() public hideOtherPopups: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public discountSum: number;
    @Input() public maskInput: string;
    @Input() public prefixInput: string;
    @Input() public suffixInput: string;
    public discountFromPer: boolean = true;
    public discountFromVal: boolean = true;
    public discountPercentageModal: number = 0;
    public discountFixedValueModal: number = 0;
    @ViewChild('disInptEle', { static: true }) public disInptEle: ElementRef;

    @Input() public discountMenu: boolean;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Mask format for decimal number and comma separation  */
    public inputMaskFormat: string = '';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** List of discounts */
    private discountsList: any[] = [];
    /** True if get discounts list api call in progress */
    private getDiscountsLoading: boolean = false;

    constructor(
        private store: Store<AppState>,
        private settingsDiscountService: SettingsDiscountService, private generalService: GeneralService,
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

        if (this.defaultDiscount && this.defaultDiscount.discountType === 'FIX_AMOUNT') {
            this.discountFixedValueModal = this.defaultDiscount.amount;
        } else {
            this.discountPercentageModal = (this.defaultDiscount) ? this.defaultDiscount.amount : 0;
        }

        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
        });
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
     * @memberof LedgerDiscountComponent
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
                    obj.particular = acc.linkAccount.uniqueName;
                    obj.discountUniqueName = acc.uniqueName;
                    obj.name = acc.name;
                    this.discountAccountsDetails.push(obj);
                }
            } else {
                this.discountAccountsDetails = [];
            }
        });
    }

    public discountFromInput(type: 'FIX_AMOUNT' | 'PERCENTAGE', event: any) {
        this.defaultDiscount.amount = parseFloat(String(event.target.value).replace(/[,'\s]/g, ''));
        this.defaultDiscount.discountValue = parseFloat(String(event.target.value).replace(/[,'\s]/g, ''));
        this.defaultDiscount.discountType = type;

        this.change();

        if (!event.target.value) {
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
    public change(discount?: any, event?: boolean) {
        this.discountTotalUpdated.emit({ discount: discount, isActive: event });
    }

    public trackByFn(index) {
        return index;
    }

    public hideDiscountMenu() {
        this.discountMenu = false;
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
