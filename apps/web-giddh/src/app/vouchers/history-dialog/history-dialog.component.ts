import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralService } from '../../services/general.service';
import { PAGE_SIZE_OPTIONS, VoucherTypeEnum } from '../utility/vouchers.const';
import { GIDDH_DATE_FORMAT_TIME } from '../../shared/helpers/defaultDateFormat';

@Component({
    selector: 'app-history-dialog',
    templateUrl: './history-dialog.component.html',
    styleUrls: ['./history-dialog.component.scss'],
    providers: [VoucherComponentStore]
})
export class HistoryDialogComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Voucher Versions is in progress Observable */
    public isVoucherVersionsInProgress$: Observable<any> = this.componentStore.isVoucherVersionsInProgress$;
    /** Voucher Versions response state Observable */
    public voucherVersionsResponse$: Observable<any> = this.componentStore.voucherVersionsResponse$;
    /** Holds List of Version History */
    public versionHistory: any;
    /** Holds page Size Options for pagination */
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    /** Hold Pagination Information */
    public pagination: any = {
        page: 1,
        count: this.pageSizeOptions[0]
    }
    /** Holds Date format with time global constant */
    public giddhDateFormatWithTime: string = GIDDH_DATE_FORMAT_TIME;

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        private componentStore: VoucherComponentStore,
        private generalService: GeneralService
    ) { }

    /**
    * Initializes the component
    *
    * @memberof HistoryDialogComponent
    */
    public ngOnInit(): void {
        if (this.inputData.model) {
            this.getVoucherVersions();
            this.voucherVersionsResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    let versions = response;
                    if (versions.results) {
                        versions.items = versions.results;
                        delete versions.results;
                    }
                    if (versions.items && versions.items.length > 0) {
                        versions.items.forEach(result => {
                            result.versionTime = new Date(result.versionTime);
                            result['userName'] =  this.getByUserText(result.user?.name);
                            if (result.changes && result.changes.length > 0) {
                                result.changes.forEach(change => {
                                    change.message = this.getVersionMessage(this.inputData.model?.voucherType === VoucherTypeEnum.purchaseOrder, change);
                                });
                            }
                        });
                    }
                    this.versionHistory = versions;
                }
            });
        }
    }

    /**
    * Handle Page Change event and Make API Call
    *
    * @param {*} event
    * @memberof HistoryDialogComponent
    */
    public handlePageChange(event: any): void {
        this.pagination.count = event.pageSize;
        this.pagination.page = event.pageIndex + 1;
        this.getVoucherVersions();
    }

    /**
     * Get Voucher Versions list API call
     *
     * @private
     * @memberof HistoryDialogComponent
     */
    private getVoucherVersions(): void {
        const model = this.inputData.model;
        model.getRequestObject.page = this.pagination.page;
        model.getRequestObject.count = this.pagination.count;
        this.componentStore.getVoucherVersions({ ...model });
    }

    /**
     * This will return the by user text
     *
     * @private
     * @param {*} user
     * @return {*}  {string}
     * @memberof HistoryDialogComponent
     */
    private getByUserText(user: any): string {
        let byUser = this.inputData?.localeData?.by_user;
        byUser = byUser?.replace("[USER]", user);
        return byUser;
    }

    /**
     * This will return the version message based on change
     *
     * @param {string} type
     * @param {*} change
     * @returns {string}
     * @memberof HistoryDialogComponent
     */
    public getVersionMessage(isPurchaseOrder: boolean, change: any): string {
        let message = "";
        let revisionField = this.generalService.getRevisionField(change.type);

        if (change.optType === "CREATE") {
            if (isPurchaseOrder) {
                let poCreated = this.inputData?.localeData?.po_created;
                poCreated = poCreated?.replace("[VALUE]", change.newValue);
                message += poCreated;
            } else {
                let voucherCreated = this.inputData?.localeData?.voucher_created;
                voucherCreated = voucherCreated?.replace("[VALUE]", ((change.newValue) ? change.newValue : change.oldValue));
                message += voucherCreated;
            }
        } else {
            let valueChanged = this.inputData?.localeData?.value_changed;
            valueChanged = valueChanged?.replace("[FIELD]", revisionField)?.replace("[VALUE]", change.newValue);
            message += valueChanged;
        }

        return message;
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof HistoryDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
