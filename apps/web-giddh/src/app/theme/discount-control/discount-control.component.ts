import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LedgerDiscountClass } from '../../models/api-models/SettingsDiscount';
import { ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'discount-control-component',
    templateUrl: './discount-control-component.html',
    styleUrls: ['./discount-control-component.scss']
})

export class DiscountControlComponent implements OnInit, OnDestroy, OnChanges {

    public get defaultDiscount(): LedgerDiscountClass {
        return this.discountAccountsDetails[0];
    }
    /** True if field is read only */
    @Input() public readonly: boolean = false;
    @Input() public discountAccountsDetails: LedgerDiscountClass[];
    @Input() public ledgerAmount: number = 0;
    @Input() public totalAmount: number = 0;
    @Input() public showHeaderText: boolean = true;
    @Output() public discountTotalUpdated: EventEmitter<{ discount: any, isActive: boolean, discountType?: any }> = new EventEmitter();
    @Output() public hideOtherPopups: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public discountSum: number;
    @Input() public maskInput: string;
    @Input() public prefixInput: string;
    @Input() public suffixInput: string;
    public discountFromPer: boolean = true;
    public discountFromVal: boolean = true;
    @Input() public discountPercentageModal: number = 0;
    @Input() public discountFixedValueModal: number = 0;
    @ViewChild('disInptEle', { static: true }) public disInptEle: ElementRef;

    @Input() public discountMenu: boolean;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Mask format for decimal number and comma separation  */
    public inputMaskFormat: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** List of discounts */
    @Input() public discountsList: any[] = [];

    constructor(
        private store: Store<AppState>
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
        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('discountAccountsDetails' in changes && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue) {
            this.prepareDiscountList();
            if ('totalAmount' in changes && changes.totalAmount.currentValue !== changes.totalAmount.previousValue) {
                this.change();
            }

            if ('discountFixedValueModal' in changes && changes.discountFixedValueModal.currentValue !== changes.discountFixedValueModal.previousValue) {
                this.change();
            }
            if ('discountPercentageModal' in changes && changes.discountPercentageModal.currentValue !== changes.discountPercentageModal.previousValue) {
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
        this.defaultDiscount.amount = parseFloat(String(event.target?.value)?.replace(/[,'\s]/g, ''));
        this.defaultDiscount.discountValue = parseFloat(String(event.target?.value)?.replace(/[,'\s]/g, ''));
        this.defaultDiscount.discountType = type;
        this.change();
        if (!event.target?.value) {
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
        this.discountTotalUpdated.emit({ discount: (this.defaultDiscount.amount || this.defaultDiscount.discountValue), isActive: event, discountType: this.defaultDiscount.discountType });
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

    /**
     * Shows discount menu
     *
     * @memberof DiscountControlComponent
     */
    public showDiscountMenu(): void {
        this.discountMenu = true;
        this.hideOtherPopups.emit(true);
    }
}
