import { GstOverViewRequest, GstOverViewResult, GstOverViewSummary } from '../../../../../models/api-models/GstReconcile';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ReconcileActionState } from '../../../../../store/GstReconcile/GstReconcile.reducer';
import { AppState } from '../../../../../store';
import { takeUntil } from 'rxjs/operators';
import { GstReport } from '../../../../constants/gst.constant';
import { GstReconcileActions } from 'apps/web-giddh/src/app/actions/gst-reconcile/GstReconcile.actions';

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

    constructor(private store: Store<AppState>, private route: Router, private gstAction: GstReconcileActions) {
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
        this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';

        this.gstr1OverviewData$.subscribe(data => {
            if (this.selectedGst === GstReport.Gstr1) {
                this.gstrOverviewData = data;
            }
        });

        this.gstr2OverviewData$.subscribe(data => {
            if (this.selectedGst === GstReport.Gstr2) {
                this.gstrOverviewData = data;
            }
        });

        let request: GstOverViewRequest = new GstOverViewRequest();
        request.from = this.currentPeriod.from;
        request.to = this.currentPeriod.to;
        request.gstin = this.activeCompanyGstNumber;

        this.store.pipe(select(state => state.gstR.gstr1OverViewDataFetchedSuccessfully), takeUntil(this.destroyed$)).subscribe(response => {
            if (!response) {
                this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr1, request));
            }
        });
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
        if (obj.gstReturnType === 'hsnsac') {
            this.hsnSacSelected.emit();
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
        this.route.navigate(['pages', 'gstfiling', 'filing-return', 'transaction'], { queryParams: { return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, type: param.type, entityType: param.entityType, status: param.status, selectedGst: this.activeCompanyGstNumber } });
    }

    public ngOnDestroy() {
        this.store.dispatch(this.gstAction.resetGstr1OverViewResponse());
        this.store.dispatch(this.gstAction.resetGstr2OverViewResponse());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public mapResponseData(data: GstOverViewSummary[], sequencingList: SequenceConfig[]): GstOverViewSummary[] {
        let manipulatedData: GstOverViewSummary[] = _.cloneDeep(data);

        manipulatedData = _.sortBy(manipulatedData, (o: GstOverViewSummary) => {
            let index = sequencingList.findIndex(f => f.gstReturnType === o.gstReturnType);
            o.name = sequencingList[index].name;
            return index;
        });
        return manipulatedData;
    }
}
