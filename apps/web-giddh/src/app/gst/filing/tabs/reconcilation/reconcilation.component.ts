import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ReconcileActionState } from '../../../../store/gst-reconcile/GstReconcile.reducer';
import { GstReconcileActionsEnum, GstReconcileInvoiceDetails, GstReconcileInvoiceRequest } from '../../../../models/api-models/GstReconcile';
import { AppState } from '../../../../store';
import { publishReplay, refCount, take, takeUntil } from 'rxjs/operators';
import { GstReconcileActions } from '../../../../actions/gst-reconcile/gst-reconcile.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { GstReport } from '../../../constants/gst.constant';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Configuration, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { environment } from 'apps/web-giddh/src/environments/environment';

@Component({
    selector: 'reconcile',
    templateUrl: './reconcilation.component.html',
    styleUrls: ['./reconcilation.component.scss'],
    standalone: false
})
export class ReconcileComponent implements OnInit, OnDestroy {
    @Input() public data: GstReconcileInvoiceDetails = null;
    @Input() public currentPeriod: any = null;
    @Input() public activeCompanyGstNumber: string = '';
    @Input() public selectedGst: string = '';
    @Input() public selectedTab: string = '';
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public gstReconcileInvoiceRequestInProcess$: Observable<boolean>;
    public gstAuthenticated$: Observable<boolean>;
    public gstNotFoundOnGiddhData$: Observable<ReconcileActionState>;
    public gstNotFoundOnPortalData$: Observable<ReconcileActionState>;
    public gstMatchedData$: Observable<ReconcileActionState>;
    public gstPartiallyMatchedData$: Observable<ReconcileActionState>;
    public reconcileActiveTab: GstReconcileActionsEnum = GstReconcileActionsEnum.notfoundonportal;
    public imgPath: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Returns the enum to be used in template */
    public get GstReport() {
        return GstReport;
    }
    /** Holds active tab index */
    public activeTabIndex: number = 0;
    /** Holds page size options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Hold table page index number */
    public pageIndex: number = 0;

    constructor(
        private store: Store<AppState>,
        @Inject(ServiceConfig) private serviceConfig,
        private reconcileActions: GstReconcileActions
    ) {
        this.gstReconcileInvoiceRequestInProcess$ = this.store.pipe(select(s => s.gstReconcile.isGstReconcileInvoiceInProcess), takeUntil(this.destroyed$));
        this.gstAuthenticated$ = this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$));
        this.gstNotFoundOnGiddhData$ = this.store.pipe(select(p => p.gstReconcile.gstReconcileData.notFoundOnGiddh), takeUntil(this.destroyed$), publishReplay(1), refCount());
        this.gstNotFoundOnPortalData$ = this.store.pipe(select(p => p.gstReconcile.gstReconcileData.notFoundOnPortal), takeUntil(this.destroyed$),
            publishReplay(1), refCount());
        this.gstMatchedData$ = this.store.pipe(select(p => p.gstReconcile.gstReconcileData.matched), takeUntil(this.destroyed$), publishReplay(1), refCount());
        this.gstPartiallyMatchedData$ = this.store.pipe(select(p => p.gstReconcile.gstReconcileData.partiallyMatched), takeUntil(this.destroyed$), publishReplay(1), refCount());
    }

    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : environment.AppUrl + environment.APP_FOLDER + 'assets/images/gst/';
        this.fireGstReconcileRequest(GstReconcileActionsEnum.notfoundonportal);
    }

    /**
     * Handle tab change event and make API call
     *
     * @param {MatTabChangeEvent} event
     * @memberof ReconcileComponent
     */
    public reconcileTabChanged(event: MatTabChangeEvent): void {
        if (event) {
            this.activeTabIndex = event.index;
            this.selectedTab = event.tab.textLabel;
            let action = '';
            switch (event.tab.textLabel) {
                case this.localeData?.filing?.missing_in_gstn:
                    action = 'notfoundonportal';
                    break;
                case this.localeData?.filing?.missing_in_giddh:
                    action = 'notfoundongiddh';
                    break;
                case this.localeData?.filing?.partially_matched:
                    action = 'partiallymatched';
                    break;
                case this.localeData?.filing?.matched:
                    action = 'matched';
                    break;
                default:
                    action = 'notfoundonportal';
            }

            this.reconcileActiveTab = GstReconcileActionsEnum[action];
            const pageInfo = this.getPageInfo();
            this.fireGstReconcileRequest(this.reconcileActiveTab, pageInfo.pageNumber, false, pageInfo.count);
        }
    }
    /**
     * Handle the fire gst reconcile request
     *
     * @param action
     * @param page
     * @param refresh
     * @param count
     * @returns
     */
    public fireGstReconcileRequest(action: GstReconcileActionsEnum, page: number = 1, refresh: boolean = false, count: number = PAGINATION_LIMIT) {
        if (!this.currentPeriod) {
            return;
        }
        let request: GstReconcileInvoiceRequest = new GstReconcileInvoiceRequest();
        request.from = this.currentPeriod.from;
        request.to = this.currentPeriod.to;
        request.page = page;
        request.count = count;
        request.refresh = refresh;
        request.action = action;
        request.gstin = this.activeCompanyGstNumber;
        request.gstReturnType = this.selectedGst === GstReport.Gstr1 ? 'gstr1' : 'gstr2';
        this.store.dispatch(this.reconcileActions.GstReconcileInvoiceRequest(request));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Get page info
     *
     * @returns {{ pageNumber: number, count: number }}
     * @memberof ReconcileComponent
     */
    public getPageInfo(): { pageNumber: number, count: number } {
        const page = {
            pageNumber: 1,
            count: PAGINATION_LIMIT
        }

        switch (this.reconcileActiveTab) {
            case GstReconcileActionsEnum.notfoundongiddh:
                this.gstNotFoundOnGiddhData$.pipe(take(1)).subscribe(data => {
                    if (data && data.data) {
                        page.pageNumber = data.data.page;
                        page.count = data.data.count;
                    }
                });
                break;
            case GstReconcileActionsEnum.notfoundonportal:
                this.gstNotFoundOnPortalData$.pipe(take(1)).subscribe(data => {
                    if (data && data.data) {
                        page.pageNumber = data.data.page;
                        page.count = data.data.count;
                    }
                });
                break;
            case GstReconcileActionsEnum.matched:
                this.gstMatchedData$.pipe(take(1)).subscribe(data => {
                    if (data && data.data) {
                        page.pageNumber = data.data.page;
                        page.count = data.data.count;
                    }
                });
                break;
            case GstReconcileActionsEnum.partiallymatched:
                this.gstPartiallyMatchedData$.pipe(take(1)).subscribe(data => {
                    if (data && data.data) {
                        page.pageNumber = data.data.page;
                        page.count = data.data.count;
                    }
                });
                break;
        }

        return page;
    }

    /**
     * Handle page change event and make API call
     *
     * @param {*} event
     * @param {string} action
     * @memberof ReconcileComponent
     */
    public reconcilePageChanged(event: any, action: string): void {
        if (event) {
            this.pageIndex = event.pageIndex;
            const pageIndex = event.pageIndex + 1;
            this.fireGstReconcileRequest(GstReconcileActionsEnum[action], pageIndex, false, event.pageSize);
        }
    }
}
