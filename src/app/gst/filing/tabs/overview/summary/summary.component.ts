import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ReconcileActionState } from 'app/store/GstReconcile/GstReconcile.reducer';
import { OverViewResult, OverViewSummary } from '../../../../../models/api-models/GstReconcile';

interface SequenceConfig {
  name: string;
  gstReturnType: string;
  index: number;
}

export const GstR1SummarySequencing: SequenceConfig[] = [
  {name: 'B2B Invoices', gstReturnType: 'b2b', index: 1},
  {name: 'B2C (Large) Invoices', gstReturnType: 'b2cl', index: 2},
  {name: 'Export Invoices', gstReturnType: 'export', index: 3},
  {name: 'B2C (Small) Invoices', gstReturnType: 'b2cs', index: 4},
  {name: 'Exempt', gstReturnType: 'nil', index: 5},
  {name: 'Credit / Debit Notes / Refund Vouchers', gstReturnType: 'CreditNote/DebitNote/RefundVouchers', index: 6},
  {name: 'Advance Payments', gstReturnType: 'advance-payments', index: 7},
  {name: 'Tax Paid', gstReturnType: 'taxPaid', index: 8},
  {name: 'HSN Summary', gstReturnType: 'hsnsac', index: 9}
];

export const GstR2SummarySequencing: SequenceConfig[] = [
  {name: 'B2B Invoices', gstReturnType: 'b2b', index: 1},
  {name: 'B2BUR Invoices', gstReturnType: 'b2bur', index: 2},
  {name: 'Credit/Debit Notes (Registered)', gstReturnType: 'cdnr', index: 3},
  {name: 'Credit/Debit Notes (Unregistered)', gstReturnType: 'cdnUr', index: 4},
  {name: 'Import of Goods / Capital Goods', gstReturnType: 'impg', index: 5},
  {name: 'Import of Services', gstReturnType: 'imps', index: 6},
  {name: 'Nil Rated Invoices', gstReturnType: 'nil', index: 7},
  {name: 'HSN / SAC Summary', gstReturnType: 'hsnsac', index: 8},
];

@Component({
  selector: 'overview-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['summary.component.css'],
})
export class OverviewSummaryComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() public currentPeriod: any = null;
  @Input() public selectedGst: string = null;
  @Input() public activeCompanyGstNumber: string = null;
  @Input() public isTransactionSummary: boolean = false;
  @Output() public SelectTxn: EventEmitter<any> = new EventEmitter(null);

  public gstOverviewData$: Observable<OverViewResult>;
  public gstOverviewData: OverViewResult = new OverViewResult();
  public companyGst$: Observable<string> = of('');
  public gstOverviewDataInProgress$: Observable<boolean>;
  public imgPath: string = '';
  public summaryResponse: any = [];
  public gstFoundOnGiddh$: Observable<boolean>;
  public gstNotFoundOnGiddhData$: Observable<ReconcileActionState>;
  public gstNotFoundOnPortalData$: Observable<ReconcileActionState>;
  public gstMatchedData$: Observable<ReconcileActionState>;
  public gstPartiallyMatchedData$: Observable<ReconcileActionState>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private gstAction: GstReconcileActions, private _store: Store<AppState>, private _route: Router, private activatedRoute: ActivatedRoute) {
    this.gstOverviewData$ = this._store.select(p => p.gstR.overViewData).pipe(takeUntil(this.destroyed$));
    this.companyGst$ = this._store.select(p => p.gstR.activeCompanyGst).pipe(takeUntil(this.destroyed$));
    this.gstOverviewDataInProgress$ = this._store.select(p => p.gstR.overViewDataInProgress).pipe(takeUntil(this.destroyed$));
    this.gstFoundOnGiddh$ = this._store.select(p => p.gstReconcile.gstFoundOnGiddh).pipe(takeUntil(this.destroyed$));
    this.gstNotFoundOnGiddhData$ = this._store.select(p => p.gstReconcile.gstReconcileData.notFoundOnGiddh).pipe(takeUntil(this.destroyed$));
    this.gstNotFoundOnPortalData$ = this._store.select(p => p.gstReconcile.gstReconcileData.notFoundOnPortal).pipe(takeUntil(this.destroyed$));
    this.gstMatchedData$ = this._store.select(p => p.gstReconcile.gstReconcileData.matched).pipe(takeUntil(this.destroyed$));
    this.gstPartiallyMatchedData$ = this._store.select(p => p.gstReconcile.gstReconcileData.partiallyMatched).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
    this.companyGst$.subscribe(a => {
      if (a) {
        this.activeCompanyGstNumber = a;
      }
    });
    this.gstOverviewData$.subscribe((a) => {
      if (a && a.summary) {
        this.gstOverviewData.count = a.count;
        this.gstOverviewData.summary = this.mapResponseData(a.summary, this.selectedGst === 'gstr1' ? GstR1SummarySequencing : GstR2SummarySequencing);
        console.log(this.gstOverviewData.summary);
      }
    });
  }

  /**
   * viewTransactions
   */
  public viewTransactions(obj: OverViewSummary) {
    if (obj.gstReturnType === 'hsnsac' || obj.gstReturnType === 'CreditNote/DebitNote/RefundVouchers' || (obj.name === 'Nil Rated Invoices' && this.selectedGst === 'gstr2')) {
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
    this._route.navigate(['pages', 'gstfiling', 'filing-return', 'transaction'], {queryParams: {return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, type: param.type, entityType: param.entityType, status: param.status}});
  }

  public ngOnChanges(s: SimpleChanges) {
    //
  }

  public ngAfterViewInit() {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
  }

  public mapResponseData(data: OverViewSummary[], sequencingList: SequenceConfig[]): OverViewSummary[] {
    let manipulatedData: OverViewSummary[] = _.cloneDeep(data);

    manipulatedData = _.sortBy(manipulatedData, (o: OverViewSummary) => {
      let index = sequencingList.findIndex(f => f.gstReturnType === o.gstReturnType);
      o.name = sequencingList[index].name;
      return index;
    });
    // _.forEach(manipulatedData, obj => {
    //   let selectedObj = _.find(sequencingList, o => o.gstReturnType === obj.gstReturnType);
    //
    //   if (selectedObj) {
    //     obj.name = selectedObj.name;
    //     obj.index = selectedObj.index;
    //   }
    // });
    // manipulatedData = _.sortBy(manipulatedData, (o) => o.index);
    return manipulatedData;
  }
}
