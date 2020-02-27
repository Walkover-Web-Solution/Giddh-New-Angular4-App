import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ReverseChargeReportRequest } from '../../../models/api-models/ReverseCharge';
import { PAGINATION_LIMIT } from '../../../app.constant';
import { Observable, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { take, takeUntil } from 'rxjs/operators';
import { ToasterService } from '../../../services/toaster.service';
import { ReverseChargeService } from '../../../services/reversecharge.service';

@Component({
    selector: 'reverse-charge-report',
    templateUrl: './reverse-charge-report.component.html',
    styleUrls: ['./reverse-charge-report.component.scss']
})

export class ReverseChargeReport implements OnInit, OnDestroy {
    public showEntryDate = true;
    public activeCompanyUniqueName$: Observable<string>;
    public activeCompany: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public reverseChargeReportRequest: ReverseChargeReportRequest = {
        from: '',
        to: '',
        sort: '',
        sortBy: '',
        q: '',
        page: 1,
        count: PAGINATION_LIMIT
    };
    public isLoading: boolean = false;
    public reverseChargeReportResults: any = {};
    public paginationLimit: number = PAGINATION_LIMIT;

    constructor(private store: Store<AppState>, private toasty: ToasterService, private cdRef: ChangeDetectorRef, private reverseChargeService: ReverseChargeService) {
        this.activeCompanyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), (takeUntil(this.destroyed$)));
    }

    ngOnInit(): void {
        this.activeCompanyUniqueName$.pipe(take(1)).subscribe(activeCompanyName => {
            this.store.pipe(select(state => state.session.companies), takeUntil(this.destroyed$)).subscribe(res => {
                if (!res) {
                    return;
                }
                res.forEach(cmp => {
                    if (cmp.uniqueName === activeCompanyName) {
                        this.activeCompany = cmp;
                        this.getReverseChargeReport(false);
                    }
                });
            });
        });
    }

    public toggleSearch(fieldName: string) {
        if (fieldName === 'invoiceNumber') {
            this.showEntryDate = true;
        }
    }

    /**
     * This function will destroy the subscribers
     *
     * @memberof VatReportTransactionsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This function will change the page of vat report
     *
     * @param {*} event
     * @memberof VatReportTransactionsComponent
     */
    public pageChanged(event: any): void {
        if(this.reverseChargeReportRequest.page != event.page) {
            this.reverseChargeReportResults.results = [];
            this.reverseChargeReportRequest.page = event.page;
            this.getReverseChargeReport(false);
        }
    }

    /**
     * This function will get the data of vat detailed report
     *
     * @param {boolean} resetPage
     * @memberof VatReportTransactionsComponent
     */
    public getReverseChargeReport(resetPage: boolean): void {
        if (this.activeCompany && !this.isLoading) {
            this.isLoading = true;

            if (resetPage) {
                this.reverseChargeReportRequest.page = 1;
            }

            this.reverseChargeReportResults = [];

            this.reverseChargeService.getReverseChargeReport(this.activeCompany.uniqueName, this.reverseChargeReportRequest).subscribe((res) => {
                if (res.status === 'success') {
                    this.reverseChargeReportResults = res.body;
                    this.cdRef.detectChanges();
                } else {
                    this.toasty.errorToast(res.message);
                }
                this.isLoading = false;
            });
        }
    }
}
