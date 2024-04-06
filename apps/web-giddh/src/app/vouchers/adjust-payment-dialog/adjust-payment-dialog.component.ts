import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { ReplaySubject, takeUntil } from 'rxjs';
import * as dayjs from 'dayjs';

@Component({
    selector: 'voucher-adjustments',
    templateUrl: './adjust-payment-dialog.component.html',
    styleUrls: ['./adjust-payment-dialog.component.scss']
})
export class AdjustPaymentDialogComponent implements OnInit, OnDestroy {
    /** Taking account details */
    @Input() public account: any;
    /** Taking voucher details */
    @Input() public voucherDetails: any;
    /** Taking voucher totals */
    @Input() public voucherTotals: any;
    /** Taking  */
    @Input() public isMultiCurrencyVoucher: boolean;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds company specific data */
    public settings: any = {
        baseCurrency: '',
        baseCurrencySymbol: '',
        accountCurrencySymbol: '',
        inputMaskFormat: '',
        giddhBalanceDecimalPlaces: 2
    };
    /**  This will use for dayjs */
    public dayjs = dayjs;

    constructor(
        private componentStore: VoucherComponentStore
    ) {

    }

    public ngOnInit() {
        if (this.account?.baseCurrencySymbol) {
            this.settings.accountCurrencySymbol = this.account?.baseCurrencySymbol;
        }

        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(profile => {
            this.settings.baseCurrency = profile.baseCurrency;
            this.settings.baseCurrencySymbol = profile.baseCurrencySymbol;
            this.settings.inputMaskFormat = profile.balanceDisplayFormat?.toLowerCase() || '';
            this.settings.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}