import { Component, Output, EventEmitter, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { ToasterService } from '../../services/toaster.service';
import { PAGINATION_LIMIT } from '../../app.constant';
import { GeneralService } from '../../services/general.service';
import { PurchaseRecordService } from '../../services/purchase-record.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { InvoiceService } from '../../services/invoice.service';
import { cloneDeep } from '../../lodash-optimized';

@Component({
    selector: 'aside-revision-history',
    templateUrl: './revision-history.component.html',
    styleUrls: ['./revision-history.component.scss']
})
export class RevisionHistoryComponent implements OnDestroy {
    /* Taking PO details as input */
    @Input() public purchaseOrder: any;
    /* Taking voucher details as input */
    @Input() public selectedVoucher: any;
    /* Taking company uniquename as input */
    @Input() public companyUniqueName: any;
    /* Emitting the close popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /* This will hold the query params of get all PO versions api */
    public purchaseVersionsGetRequest: any = {
        companyUniqueName: '',
        accountUniqueName: '',
        page: 1,
        count: PAGINATION_LIMIT
    };
    /* This will hold the post params of get all PO versions api */
    public purchaseVersionsPostRequest: any = {
        purchaseNumber: '',
        uniqueName: ''
    };
    /* This will hold purchase order versions */
    public purchaseVersions: any = {};
    /* This will hold if api request is pending */
    public isLoading: boolean = false;
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;

    constructor(
        private purchaseOrderService: PurchaseOrderService,
        private toaster: ToasterService,
        private generalService: GeneralService,
        private purchaseRecordService: PurchaseRecordService,
        private cdRef: ChangeDetectorRef,
        private invoiceService: InvoiceService
        ) {

    }

    /**
     * This will send the event to close the aside pan
     *
     * @memberof RevisionHistoryComponent
     */
    public closeAsidePane(): void {
        this.closeAsideEvent.emit(true);
    }

    /**
     * This will get the revision history
     *
     * @param {boolean} resetPage
     * @memberof RevisionHistoryComponent
     */
    public getPurchaseOrderVersions(resetPage: boolean): void {
        if (this.purchaseVersionsGetRequest.companyUniqueName && this.purchaseVersionsPostRequest.purchaseNumber) {
            this.isLoading = true;
            this.purchaseVersions = {};

            if (resetPage) {
                this.purchaseVersionsGetRequest.page = 1;
            }

            this.purchaseOrderService.getAllVersions(this.purchaseVersionsGetRequest, this.purchaseVersionsPostRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res) {
                    if (res.status === 'success') {
                        if (res.body) {
                            let versions = res.body;

                            if (versions.results && versions.results.length > 0) {
                                versions.results.forEach(result => {
                                    result.versionTime = new Date(result.versionTime);
                                    if (result.changes && result.changes.length > 0) {
                                        result.changes.forEach(change => {
                                            change.message = this.getVersionMessage("po", change);
                                        });
                                    }
                                });
                            }

                            this.purchaseVersions = versions;
                            this.cdRef.detectChanges();
                        }
                    } else {
                        this.toaster.errorToast(res.message);
                    }
                    this.isLoading = false;
                    this.cdRef.detectChanges();
                }
            });
        }
    }

    /**
     * This will return the version message based on change
     *
     * @param {string} type
     * @param {*} change
     * @returns {string}
     * @memberof RevisionHistoryComponent
     */
    public getVersionMessage(type: string, change: any): string {
        let message = "";
        let revisionField = this.generalService.getRevisionField(change.type);

        if (change.optType === "CREATE") {
            if (type === "po") {
                let poCreated = this.localeData?.po_created;
                poCreated = poCreated?.replace("[VALUE]", change.newValue);
                message += poCreated;
            } else {
                let voucherCreated = (this.generalService.voucherApiVersion === 2) ? this.localeData?.voucher_created : this.localeData?.pb_created;
                voucherCreated = voucherCreated?.replace("[VALUE]", ((change.newValue) ? change.newValue : change.oldValue));
                message += voucherCreated;
            }
        } else {
            let valueChanged = this.localeData?.value_changed;
            valueChanged = valueChanged?.replace("[FIELD]", revisionField)?.replace("[VALUE]", change.newValue);
            message += valueChanged;
        }

        return message;
    }

    /**
     * Callback for page change event
     *
     * @param {*} event
     * @memberof RevisionHistoryComponent
     */
    public pageChanged(event: any): void {
        if (this.purchaseVersionsGetRequest.page !== event.page) {
            this.purchaseVersionsGetRequest.page = event.page;

            if (this.selectedVoucher) {
                this.getVoucherVersions(false);
            } else {
                this.getPurchaseOrderVersions(false);
            }
        }
    }

    /**
     * This will get the revision history
     *
     * @param {boolean} resetPage
     * @memberof RevisionHistoryComponent
     */
    public getVoucherVersions(resetPage: boolean): void {
        if (this.purchaseVersionsGetRequest?.companyUniqueName && this.purchaseVersionsPostRequest?.uniqueName) {
            this.isLoading = true;
            this.purchaseVersions = {};

            if (resetPage) {
                this.purchaseVersionsGetRequest.page = 1;
            }

            const apiObservable = (this.generalService.voucherApiVersion === 2) ? this.invoiceService.getVoucherVersions(this.purchaseVersionsGetRequest, this.purchaseVersionsPostRequest?.uniqueName) : this.purchaseRecordService.getAllVersions(this.purchaseVersionsGetRequest, this.purchaseVersionsPostRequest);
            apiObservable.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res) {
                    if (res.status === 'success') {
                        if (res.body) {
                            let versions = res.body;

                            if (this.generalService.voucherApiVersion === 2) {
                                versions.results = cloneDeep(versions.items);
                            }

                            if (versions?.results?.length > 0) {
                                versions?.results?.forEach(result => {
                                    result.versionTime = new Date(result.versionTime);
                                    if (result.changes && result.changes.length > 0) {
                                        result.changes.forEach(change => {
                                            change.message = this.getVersionMessage("pb", change);
                                        });
                                    }
                                });
                            }

                            this.purchaseVersions = versions;
                            this.cdRef.detectChanges();
                        }
                    } else {
                        this.toaster.errorToast(res.message);
                    }
                    this.isLoading = false;
                    this.cdRef.detectChanges();
                }
            });
        }
    }

    /**
     * Releases memory
     *
     * @memberof RevisionHistoryComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof RevisionHistoryComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;

            if (this.selectedVoucher) {
                this.purchaseVersionsGetRequest.companyUniqueName = this.companyUniqueName;
                this.purchaseVersionsGetRequest.accountUniqueName = this.selectedVoucher.account?.uniqueName;
                this.purchaseVersionsPostRequest.uniqueName = this.selectedVoucher?.uniqueName;
                this.getVoucherVersions(true);
            }

            if (this.purchaseOrder) {
                this.purchaseVersionsGetRequest.companyUniqueName = this.purchaseOrder.company?.uniqueName;
                this.purchaseVersionsGetRequest.accountUniqueName = this.purchaseOrder.account?.uniqueName;
                this.purchaseVersionsPostRequest.purchaseNumber = this.purchaseOrder.number;
                this.getPurchaseOrderVersions(true);
            }
        }
    }

    /**
     * This will return the by user text
     *
     * @param {*} user
     * @returns {string}
     * @memberof RevisionHistoryComponent
     */
    public getByUserText(user: any): string {
        let byUser = this.localeData?.by_user;
        byUser = byUser?.replace("[USER]", user);
        return byUser;
    }
}
