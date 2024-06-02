import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { ReplaySubject, takeUntil } from 'rxjs';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { SettingsTagService } from '../../services/settings.tag.service';
import { orderBy } from '../../lodash-optimized';

@Component({
    selector: 'app-payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss'],
    providers: [VoucherComponentStore]
})
export class PaymentDialogComponent implements OnInit, OnDestroy {

    @Input() public voucherDetails: any;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public dayjs = dayjs;
    /** Holds company specific data */
    public company: any = {
        baseCurrency: '',
        baseCurrencySymbol: '',
        inputMaskFormat: '',
        giddhBalanceDecimalPlaces: 0
    };
    public tags: any[] = [];

    constructor(
        private componentStore: VoucherComponentStore,
        private settingsTagService: SettingsTagService
    ) {

    }

    public ngOnInit(): void {
        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.company.baseCurrency = response.baseCurrency;
                this.company.baseCurrencySymbol = response.baseCurrencySymbol;
                this.company.inputMaskFormat = response.balanceDisplayFormat?.toLowerCase() || '';
                this.company.giddhBalanceDecimalPlaces = response.balanceDecimalPlaces;
            }
        });

        this.settingsTagService.GetAllTags().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                let arr: any[] = [];
                response?.body.forEach(tag => {
                    arr.push({ value: tag.name, label: tag.name });
                });
                this.tags = orderBy(arr, 'name');
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}