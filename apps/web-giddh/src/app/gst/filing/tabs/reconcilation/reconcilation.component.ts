import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ReconcileActionState } from '../../../../store/gst-reconcile/GstReconcile.reducer';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { GstReconcileActionsEnum, GstReconcileInvoiceDetails, GstReconcileInvoiceRequest } from '../../../../models/api-models/GstReconcile';
import { AppState } from '../../../../store';
import { publishReplay, refCount, take, takeUntil } from 'rxjs/operators';
import { GstReconcileActions } from '../../../../actions/gst-reconcile/gst-reconcile.actions';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
	selector: 'reconcile',
	templateUrl: './reconcilation.component.html',
	styleUrls: ['./reconcilation.component.scss'],
	providers: [
		{
			provide: BsDropdownConfig, useValue: { autoClose: true },
		},
		{
			provide: AlertConfig, useValue: {}
		}
	],
	animations: [
		trigger('slideInOut', [
			state('in', style({
				transform: 'translate3d(0, 0, 0)'
			})),
			state('out', style({
				transform: 'translate3d(100%, 0, 0)'
			})),
			transition('in <=> out', animate('400ms ease-in-out')),
		])
	]
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

    constructor(
        private store: Store<AppState>,
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
        this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
        this.fireGstReconcileRequest(GstReconcileActionsEnum.notfoundonportal);
    }

    public reconcileTabChanged(action: string) {
        this.reconcileActiveTab = GstReconcileActionsEnum[action];
        this.fireGstReconcileRequest(this.reconcileActiveTab, this.getPageNo());
    }

    public reconcilePageChanged(event: any, action: string) {
        this.fireGstReconcileRequest(GstReconcileActionsEnum[action], event.page);
    }

    public fireGstReconcileRequest(action: GstReconcileActionsEnum, page: number = 1, refresh: boolean = false) {
        if (!this.currentPeriod) {
            return;
        }
        let request: GstReconcileInvoiceRequest = new GstReconcileInvoiceRequest();
        request.from = this.currentPeriod.from;
        request.to = this.currentPeriod.to;
        request.page = page;
        request.refresh = refresh;
        request.action = action;
        request.gstin = this.activeCompanyGstNumber;
        this.store.dispatch(this.reconcileActions.GstReconcileInvoiceRequest(request));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getPageNo(): number {
        let page = 1;

        switch (this.reconcileActiveTab) {
            case GstReconcileActionsEnum.notfoundongiddh:
                this.gstNotFoundOnGiddhData$.pipe(take(1)).subscribe(data => {
                    if (data && data.data) {
                        page = data.data.page;
                    }
                });
                break;
            case GstReconcileActionsEnum.notfoundonportal:
                this.gstNotFoundOnPortalData$.pipe(take(1)).subscribe(data => {
                    if (data && data.data) {
                        page = data.data.page;
                    }
                });
                break;
            case GstReconcileActionsEnum.matched:
                this.gstMatchedData$.pipe(take(1)).subscribe(data => {
                    if (data && data.data) {
                        page = data.data.page;
                    }
                });
                break;
            case GstReconcileActionsEnum.partiallymatched:
                this.gstPartiallyMatchedData$.pipe(take(1)).subscribe(data => {
                    if (data && data.data) {
                        page = data.data.page;
                    }
                });
                break;
        }

        return page;
    }
}