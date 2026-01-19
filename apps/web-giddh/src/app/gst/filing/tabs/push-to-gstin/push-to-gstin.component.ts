import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { GstReconcileActions } from '../../../../actions/gst-reconcile/gst-reconcile.actions';
import { select, Store } from '@ngrx/store';
import { GstDatePeriod, Gstr1SummaryRequest, Gstr1SummaryResponse } from '../../../../models/api-models/GstReconcile';
import { ReplaySubject } from 'rxjs';
import { AppState } from '../../../../store';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * Handles Component functionality
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'push-to-gstin',
    templateUrl: './push-to-gstin.component.html',
    styleUrls: ['./push-to-gstin.component.scss'],
    standalone: false
})
/**
 * PushToGstInComponent component
 * Handles pushtogstin functionality and user interactions
 */
export class PushToGstInComponent implements OnInit, OnDestroy {
    @Input() public currentPeriod: GstDatePeriod = null;
    @Input() public activeCompanyGstNumber: string = '';
    @Input() public selectedGst: string = '';
    /** True, if HSN tab needs to be opened by default (required if a user clicks on HSN data in GSTR1) */
    @Input() public showHsn: boolean;
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public gstr1SummaryDetails: Gstr1SummaryResponse;
    public gstr1SummaryDetailsInProcess = signal<boolean>(false);
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private gstrAction: GstReconcileActions,
        private changeDetectorRef: ChangeDetectorRef,
        private route: Router) {

        this.store.pipe(select(s => s.gstR.gstr1SummaryResponse), takeUntil(this.destroyed$)).subscribe(result => {
            this.gstr1SummaryDetails = result;
            /**
             * Handles if functionality
             */
            if (this.showHsn) {
                this.changeDetectorRef.detectChanges();
            }
        });

        this.store.pipe(select(s => s.gstR.gstr1SummaryDetailsInProcess), takeUntil(this.destroyed$)).subscribe(result => {
            this.gstr1SummaryDetailsInProcess.set(result);
        });
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.getSummary();
    }

    /**
     * Retrieves summary data
     */
    public getSummary() {
        let request: Gstr1SummaryRequest = new Gstr1SummaryRequest();
        request.gstin = this.activeCompanyGstNumber;
        request.from = this.currentPeriod.from;
        request.to = this.currentPeriod.to;

        this.store.dispatch(this.gstrAction.GetGSTR1SummaryDetails(request));
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Redirect to gst filing return page
     *
     * @memberof PushToGstInComponent
     */
    public redirectToGstFilingReturn(): void {
        this.route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, selectedGst: this.activeCompanyGstNumber } });
    }
}
