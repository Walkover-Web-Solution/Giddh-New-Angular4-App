import { GstOverViewResult, GstOverViewSummary } from '../../../../../models/api-models/GstReconcile';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ReconcileActionState } from '../../../../../store/GstReconcile/GstReconcile.reducer';
import { AppState } from '../../../../../store';
import { takeUntil } from 'rxjs/operators';
import { GstReport } from '../../../../constants/gst.constant';

interface SequenceConfig {
    name: string;
    gstReturnType: string;
    index: number;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'overview-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['summary.component.css'],
})
export class OverviewSummaryComponent implements OnInit, OnDestroy {

    @Input() public currentPeriod: any = null;
    @Input() public selectedGst: string = null;
    @Input() public activeCompanyGstNumber: string = null;
    @Input() public isTransactionSummary: boolean = false;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
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

    constructor(private _store: Store<AppState>, private _route: Router) {
        this.gstr1OverviewData$ = this._store.pipe(select(p => p.gstR.gstr1OverViewData), takeUntil(this.destroyed$));

        this.gstr2OverviewData$ = this._store.pipe(select(p => p.gstR.gstr2OverViewData), takeUntil(this.destroyed$));

        this.companyGst$ = this._store.pipe(select(p => p.gstR.activeCompanyGst), takeUntil(this.destroyed$));
        this.gstFoundOnGiddh$ = this._store.pipe(select(p => p.gstReconcile.gstFoundOnGiddh), takeUntil(this.destroyed$));
        this.gstNotFoundOnGiddhData$ = this._store.pipe(select(p => p.gstReconcile.gstReconcileData.notFoundOnGiddh), takeUntil(this.destroyed$));
        this.gstNotFoundOnPortalData$ = this._store.pipe(select(p => p.gstReconcile.gstReconcileData.notFoundOnPortal), takeUntil(this.destroyed$));
        this.gstMatchedData$ = this._store.pipe(select(p => p.gstReconcile.gstReconcileData.matched), takeUntil(this.destroyed$));
        this.gstPartiallyMatchedData$ = this._store.pipe(select(p => p.gstReconcile.gstReconcileData.partiallyMatched), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.imgPath = (isElectron || isCordova) ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';

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

    }

    /**
     * viewTransactions
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
        this._route.navigate(['pages', 'gstfiling', 'filing-return', 'transaction'], { queryParams: { return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, type: param.type, entityType: param.entityType, status: param.status, selectedGst: this.activeCompanyGstNumber } });
    }

    public ngOnDestroy() {
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
