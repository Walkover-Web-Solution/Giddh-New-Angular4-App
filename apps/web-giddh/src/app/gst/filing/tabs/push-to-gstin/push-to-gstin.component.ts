import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GstReconcileActions } from '../../../../actions/gst-reconcile/gst-reconcile.actions';
import { select, Store } from '@ngrx/store';
import { GstDatePeriod, Gstr1SummaryRequest, Gstr1SummaryResponse } from '../../../../models/api-models/GstReconcile';
import { ReplaySubject } from 'rxjs';
import { AppState } from '../../../../store';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'push-to-gstin',
    templateUrl: './push-to-gstin.component.html',
    styleUrls: ['./push-to-gstin.component.scss'],
})
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
    public gstr1SummaryDetailsInProcess: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private gstrAction: GstReconcileActions,
        private changeDetectorRef: ChangeDetectorRef, 
        private route: Router) {

        this.store.pipe(select(s => s.gstR.gstr1SummaryResponse), takeUntil(this.destroyed$)).subscribe(result => {
            this.gstr1SummaryDetails = result;
            if (this.showHsn) {
                this.changeDetectorRef.detectChanges();
            }
        });

        this.store.pipe(select(s => s.gstR.gstr1SummaryDetailsInProcess), takeUntil(this.destroyed$)).subscribe(result => {
            this.gstr1SummaryDetailsInProcess = result;
        });
    }

    public ngOnInit() {
        this.getSummary();
    }

    public getSummary() {
        let request: Gstr1SummaryRequest = new Gstr1SummaryRequest();
        request.gstin = this.activeCompanyGstNumber;
        request.from = this.currentPeriod.from;
        request.to = this.currentPeriod.to;

        this.store.dispatch(this.gstrAction.GetGSTR1SummaryDetails(request));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Navigates back
     *
     * @memberof PushToGstInComponent
     */
    public goBack() {
        this.route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, selectedGst: this.activeCompanyGstNumber } });
    }
}