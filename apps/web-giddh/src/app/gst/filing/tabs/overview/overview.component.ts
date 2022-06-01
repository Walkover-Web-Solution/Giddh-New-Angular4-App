import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GstDatePeriod } from '../../../../models/api-models/GstReconcile';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'filing-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['overview.component.scss'],
})
export class FilingOverviewComponent implements OnInit, OnDestroy {
    @Input() public currentPeriod: GstDatePeriod = new GstDatePeriod();
    @Input() public activeCompanyGstNumber: string = '';
    @Input() public selectedGst: string = '';
    @Input() public isTransactionSummary: boolean = false;
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Emits when HSN/SAC is selected */
    @Output() public hsnSacSelected: EventEmitter<void> = new EventEmitter();
    public showTransaction: boolean = false;
    public filters: any = {};
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private route: Router, private activatedRoute: ActivatedRoute) {
    }

    public ngOnInit() {
        this.activatedRoute.url.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.showTransaction = this.route.routerState.snapshot.url.includes('transaction');
        });
    }

    public selectTxn(param) {
        this.filters = param;
    }

    /**
     * Releases the memory
     *
     * @memberof FilingOverviewComponent
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
