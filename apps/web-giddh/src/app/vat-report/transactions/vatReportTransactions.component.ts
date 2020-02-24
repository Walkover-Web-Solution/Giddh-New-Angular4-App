import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil, take, delay } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VatReportTransactionsRequest } from '../../models/api-models/Vat';
import * as _ from '../../lodash-optimized';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { ToasterService } from '../../services/toaster.service';
import { VatService } from "../../services/vat.service";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { saveAs } from "file-saver";
import { PAGINATION_LIMIT } from '../../app.constant';
import { CurrentPage } from '../../models/api-models/Common';
import { GeneralActions } from '../../actions/general/general.actions';

@Component({
    selector: 'app-vat-report-transactions',
    styleUrls: ['./vatReportTransactions.component.scss'],
    templateUrl: './vatReportTransactions.component.html'
})

export class VatReportTransactionsComponent implements OnInit, OnDestroy {
    public activeCompanyUniqueName$: Observable<string>;
    public activeCompany: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public vatReportTransactions: any = {};
    public vatReportTransactionsRequest: VatReportTransactionsRequest = {
        from: '',
        to: '',
        taxNumber: '',
        page: 1,
        count: PAGINATION_LIMIT,
        section: ''
    };
    public isLoading: boolean = false;

    constructor(private store: Store<AppState>, private vatService: VatService, private _toasty: ToasterService, private cdRef: ChangeDetectorRef, public route: ActivatedRoute, private _router: Router, private _generalActions: GeneralActions) {
        this.activeCompanyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), (takeUntil(this.destroyed$)));
    }

    public ngOnInit() {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
			this.vatReportTransactionsRequest.from = params['from'];
			this.vatReportTransactionsRequest.to = params['to'];
        });
        
        this.route.params.pipe(takeUntil(this.destroyed$), delay(0)).subscribe(params => {
            if(params.section) {
                this.setCurrentPageTitle(params.section);
                this.vatReportTransactionsRequest.section = params.section;
            } else {
                this._router.navigate(['pages', 'vat-report']);
            }
        });
        
        this.activeCompanyUniqueName$.pipe(take(1)).subscribe(activeCompanyName => {
            this.store.pipe(select(state => state.session.companies), takeUntil(this.destroyed$)).subscribe(res => {
                if (!res) {
                    return;
                }
                res.forEach(cmp => {
                    if (cmp.uniqueName === activeCompanyName) {
                        this.activeCompany = cmp;

                        if (this.activeCompany.addresses && this.activeCompany.addresses.length > 0) {
                            this.activeCompany.addresses = [_.find(this.activeCompany.addresses, (tax) => tax.isDefault)];
                            this.getVatReportTransactions(true);
                        }
                    }
                });
            });
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getVatReportTransactions(resetPage: boolean) {
        this.isLoading = true;

        if (resetPage) {
            this.vatReportTransactionsRequest.page = 1;
        }

        if (this.activeCompany.addresses && this.activeCompany.addresses.length > 0) {
            this.vatReportTransactionsRequest.taxNumber = this.activeCompany.addresses[0].taxNumber;

            this.vatReportTransactions = [];

            this.vatService.getVatReportTransactions(this.activeCompany.uniqueName, this.vatReportTransactionsRequest).subscribe((res) => {
                if (res.status === 'success') {
                    this.vatReportTransactions = res.body;
                    this.cdRef.detectChanges();
                } else {
                    this._toasty.errorToast(res.message);
                }
                this.isLoading = false;
            });
        }
    }

    public pageChanged(event: any): void {
        this.vatReportTransactions.results = [];
        this.vatReportTransactionsRequest.page = event.page;
        this.getVatReportTransactions(false);
    }

    public setCurrentPageTitle(title) {
        let currentPageObj = new CurrentPage();
        currentPageObj.name = "Vat Report > " + title;
        currentPageObj.url = this._router.url;
        this.store.dispatch(this._generalActions.setPageTitle(currentPageObj));
    }

    // public downloadVatReportTransactions() {
    //     let vatReportRequest = new VatReportRequest();
    //     vatReportRequest.from = this.fromDate;
    //     vatReportRequest.to = this.toDate;
    //     vatReportRequest.taxNumber = this.activeCompany.addresses[0].taxNumber;

    //     this.vatService.DownloadVatReport(vatReportRequest).subscribe((res) => {
    //         if (res.status === "success") {
    //             let blob = this._generalService.base64ToBlob(res.body, 'application/xls', 512);
    //             return saveAs(blob, `VatReport.xlsx`);
    //         } else {
    //             this._toasty.clearAllToaster();
    //             this._toasty.errorToast(res.message);
    //         }
    //     });
    // }
}