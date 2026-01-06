import { GstOverViewRequest, GstOverViewResult, GstOverViewSummary } from '../../../../../models/api-models/GstReconcile';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ReconcileActionState } from '../../../../../store/gst-reconcile/GstReconcile.reducer';
import { AppState } from '../../../../../store';
import { takeUntil } from 'rxjs/operators';
import { GstReport } from '../../../../constants/gst.constant';
import { GstReconcileActions } from 'apps/web-giddh/src/app/actions/gst-reconcile/gst-reconcile.actions';
import { cloneDeep, sortBy } from '../../../../../lodash-optimized';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';
import { environment } from 'apps/web-giddh/src/environments/environment.generated';

interface SequenceConfig {
    name: string;
    gstReturnType: string;
    index: number;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'overview-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['summary.component.scss'],
    standalone: false
})
export class OverviewSummaryComponent implements OnInit, OnDestroy {
    @Input() public currentPeriod: any = null;
    @Input() public selectedGst: string = null;
    @Input() public activeCompanyGstNumber: string = null;
    @Input() public isTransactionSummary: boolean = false;
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public SelectTxn: EventEmitter<any> = new EventEmitter(null);
    /** Emits when HSN/SAC is selected */
    @Output() public hsnSacSelected: EventEmitter<void> = new EventEmitter();
    public gstr1OverviewData$: Observable<GstOverViewResult>;
    public gstr2OverviewData$: Observable<GstOverViewResult>;
    public gstrOverviewData: GstOverViewResult = new GstOverViewResult();
    public companyGst$: Observable<string> = of('');
    public imgPath: string = '';
    public gstFoundOnGiddh$: Observable<boolean>;
    public gstNotFoundOnGiddhData$: Observable<ReconcileActionState>;
    public gstNotFoundOnPortalData$: Observable<ReconcileActionState>;
    public gstMatchedData$: Observable<ReconcileActionState>;
    public gstPartiallyMatchedData$: Observable<ReconcileActionState>;
    /** Returns the enum to be used in template */
    public get GstReport() {
        return GstReport;
    }
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds table displayed columns name */
    public displayedColumns: string[] = ['description', 'total_transactions', 'taxable_amount', 'igst', 'cgst', 'sgst', 'cess'];

    constructor(@Inject(ServiceConfig) private serviceConfig,  private store: Store<AppState>, private route: Router, private gstAction: GstReconcileActions) {
        this.gstr1OverviewData$ = this.store.pipe(select(p => p.gstR.gstr1OverViewData), takeUntil(this.destroyed$));
        this.gstr2OverviewData$ = this.store.pipe(select(p => p.gstR.gstr2OverViewData), takeUntil(this.destroyed$));
        this.companyGst$ = this.store.pipe(select(p => p.gstR.activeCompanyGst), takeUntil(this.destroyed$));
        this.gstFoundOnGiddh$ = this.store.pipe(select(p => p.gstReconcile.gstFoundOnGiddh), takeUntil(this.destroyed$));
        this.gstNotFoundOnGiddhData$ = this.store.pipe(select(p => p.gstReconcile.gstReconcileData.notFoundOnGiddh), takeUntil(this.destroyed$));
        this.gstNotFoundOnPortalData$ = this.store.pipe(select(p => p.gstReconcile.gstReconcileData.notFoundOnPortal), takeUntil(this.destroyed$));
        this.gstMatchedData$ = this.store.pipe(select(p => p.gstReconcile.gstReconcileData.matched), takeUntil(this.destroyed$));
        this.gstPartiallyMatchedData$ = this.store.pipe(select(p => p.gstReconcile.gstReconcileData.partiallyMatched), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.gstr1OverviewData$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data && this.selectedGst === GstReport.Gstr1) {
                this.gstrOverviewData = this.transformedSummaryData(data);
            }
        });
        this.gstr2OverviewData$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data && this.selectedGst === GstReport.Gstr2) {
                this.gstrOverviewData = this.transformedSummaryData(data);
            }
        });

        let request: GstOverViewRequest = new GstOverViewRequest();
        request.from = this.currentPeriod.from;
        request.to = this.currentPeriod.to;
        request.gstin = this.activeCompanyGstNumber;

        this.store.pipe(select(state => state.gstR.gstr1OverViewDataFetchedSuccessfully), takeUntil(this.destroyed$)).subscribe(response => {
            if (!response && (this.selectedGst === GstReport.Gstr1 || this.selectedGst === GstReport.Gstr2)) {
                this.store.dispatch(this.gstAction.GetOverView(this.selectedGst, request));
            }
        });
    }

    /**
     * Transformed summary data to display in table
     *
     * @param data
     * @returns
     */
    private transformedSummaryData(data: GstOverViewResult): GstOverViewResult {
        if (!data?.summary?.length) return data;
        const results = { ...data };
        results.summary = results.summary.flatMap((item, index) => [
            item,
            ...(Array.isArray(item.transactions)
                ? item.transactions.map(transaction => ({
                    ...transaction,
                    parentIndex: index
                }))
                : [])
        ]);
        return results;
    }

    /**
     * View Transactions
     *
     * @param {GstOverViewSummary} obj
     * @returns
     * @memberof OverviewSummaryComponent
     */
    public viewTransactions(obj: GstOverViewSummary) {
        if (obj.gstReturnType === 'CreditNote/DebitNote/RefundVouchers') {
            return;
        }
        let param = {
            page: 1,
            count: 20,
            entityType: obj.entityType,
            gstin: this.activeCompanyGstNumber,
            type: obj.gstReturnType,
            from: this.currentPeriod.from,
            to: this.currentPeriod.to,
            status: 'all'
        };
        this.route.navigate(['pages', 'gstfiling', 'filing-return', (obj.gstReturnType === 'hsnsac' ? 'hsn-summary' : 'transaction')], { queryParams: { return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, type: param.type, entityType: param.entityType, status: param?.status, selectedGst: this.activeCompanyGstNumber } });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public mapResponseData(data: GstOverViewSummary[], sequencingList: SequenceConfig[]): GstOverViewSummary[] {
        let manipulatedData: GstOverViewSummary[] = cloneDeep(data);

        manipulatedData = sortBy(manipulatedData, (o: GstOverViewSummary) => {
            let index = sequencingList?.findIndex(f => f.gstReturnType === o.gstReturnType);
            o.name = sequencingList[index].name;
            return index;
        });
        return manipulatedData;
    }
}
