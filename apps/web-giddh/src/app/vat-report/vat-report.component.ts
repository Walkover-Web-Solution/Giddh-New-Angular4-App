import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, TemplateRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { VatReportRequest } from '../models/api-models/Vat';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { VatService } from "../services/vat.service";
import * as dayjs from 'dayjs';
import { saveAs } from "file-saver";
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { SettingsFinancialYearService } from '../services/settings.financial-year.service';
@Component({
    selector: 'app-vat-report',
    styleUrls: ['./vat-report.component.scss'],
    templateUrl: './vat-report.component.html'
})
export class VatReportComponent implements OnInit, OnDestroy {
    public vatReport: any[] = [];
    public activeCompany: any;
    public fromDate: string = '';
    public toDate: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Tax number */
    public taxNumber: string;
    /** True, if API is in progress */
    public isTaxApiInProgress: boolean;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** this will check mobile screen size */
    public isMobileScreen: boolean = false;
    /** Hold uae main table displayed columns */
    public displayedColumns: string[] = ['number', 'name', 'aed_amt', 'vat_amt', 'adjustment'];
    /** Hold uae bottom table displayed columns */
    public uaeDisplayedColumns: string[] = ['number', 'description', 'tooltip'];
    /** Hold uk main table and bottom table displayed columns */
    public ukDisplayedColumns: string[] = ['number', 'name', 'aed_amt'];
    /** Hold Zimbabwe main table displayed columns */
    public zwDisplayedColumns: string[] = ['name', 'mat-code', 'vos-amount', 'vos-decimal', 'ot-amount', 'ot-decimal'];
    /** Hold Zimbabwe table header row displayed columns */
    public zwDisplayedHeaderColumns = ['section', 'office-use', 'value-of-supply', 'output-tax'];
    /** Hold Zimbabwe table displayed columns for last section */
    public zwDisplayedColumnsForLastSection: string[] = ['name', 'amount', 'decimal'];
    /** Hold Kenya table displayed columns */
    public kenyaDisplayedColumns: string[] = ['number', 'description', 'amount', 'rate', 'ot-amount'];
    /** Hold Kenya table displayed columns */
    public kenyaDisplayedColumnsForLastSection: string[] = ['number', 'description', 'vat-amount'];
    /** Holds Section Number which  show Total Output Tax Row */
    public showTotalOutputTaxIn: number[] = [9, 19, 20, 21, 22, 23];
    /** True if active country is UK */
    public isUKCompany: boolean = false;
    /** True if active country is Zimbabwe */
    public isZimbabweCompany: boolean = false;
    /** True if active country is Kenya */
    public isKenyaCompany: boolean = false;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Hold HMRC portal url */
    public connectToHMRCUrl: string = null;
    /** Holds Current Currency Code for Zimbabwe report */
    public vatReportCurrencyCode: 'BWP' | 'USD' | 'GBP' | 'INR' | 'EUR' = 'BWP';
    /** Holds Current Currency Symbol for Zimbabwe report */
    public vatReportCurrencySymbol: string = 'P';
    /** Holds Current Currency Map Amount Decimal currency wise for Zimbabwe report */
    public vatReportCurrencyMap: string[];

    constructor(
        private store: Store<AppState>,
        private vatService: VatService,
        private generalService: GeneralService,
        private toasty: ToasterService,
        private cdRef: ChangeDetectorRef,
        private route: Router,
        private breakpointObserver: BreakpointObserver,
        public settingsFinancialYearService: SettingsFinancialYearService
    ) { }

    public ngOnInit() {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && this.activeCompany?.uniqueName !== activeCompany.uniqueName) {
                this.activeCompany = activeCompany;
                this.isUKCompany = this.activeCompany?.countryV2?.alpha2CountryCode === 'GB';
                this.isZimbabweCompany = this.activeCompany?.countryV2?.alpha2CountryCode === 'ZW';
                this.isKenyaCompany = this.activeCompany?.countryV2?.alpha2CountryCode === 'KE';
                if (this.isUKCompany) {
                    this.getURLHMRCAuthorization();
                }
            }
        });
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.breakpointObserver
            .observe(['(max-width: 767px)'])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((state: BreakpointState) => {
                this.isMobileScreen = state.matches;
                if (!this.isMobileScreen) {
                    this.asideGstSidebarMenuState = 'in';
                }
            });
            
        this.store.pipe(select(appState => appState.general.openGstSideMenu), takeUntil(this.destroyed$)).subscribe(shouldOpen => {
            if (this.isMobileScreen) {
                if (shouldOpen) {
                    this.asideGstSidebarMenuState = 'in';
                } else {
                    this.asideGstSidebarMenuState = 'out';
                }
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out'
    }

    /**
     * This will use for get vat report for uae and uk according to country code
     *
     * @memberof VatReportComponent
     */
    public getVatReport(): void {
        if (this.taxNumber) {
            let countryCode;
            let vatReportRequest = new VatReportRequest();
            vatReportRequest.from = this.fromDate;
            vatReportRequest.to = this.toDate;
            vatReportRequest.taxNumber = this.taxNumber;
            vatReportRequest.branchUniqueName = this.currentBranch?.uniqueName;

            if (this.isZimbabweCompany) {
                vatReportRequest.currencyCode = this.vatReportCurrencyCode;
                countryCode = 'ZW';
            } else if (this.isKenyaCompany) {
                vatReportRequest.currencyCode = this.vatReportCurrencyCode;
                countryCode = 'KE';
            } else {
                countryCode = 'UK';
            }
            this.vatReport = [];
            this.isLoading = true;

            if (!this.isUKCompany && !this.isZimbabweCompany && !this.isKenyaCompany) {
                this.vatService.getVatReport(vatReportRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    if (res) {
                        this.isLoading = false;
                        if (res.status === 'success') {
                            this.vatReport = res.body?.sections;
                            this.cdRef.detectChanges();
                        } else {
                            this.toasty.errorToast(res.message);
                        }
                    }
                });
            } else {
                this.vatService.getCountryWiseVatReport(vatReportRequest, countryCode).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    if (res) {
                        this.isLoading = false;
                        if (res && res?.status === 'success' && res?.body) {
                            this.vatReport = res.body?.sections;
                            if (this.isZimbabweCompany) {
                                this.vatReportCurrencyMap = res.body?.currencyMap;
                                this.vatReportCurrencySymbol = res.body?.currency?.symbol;
                            }

                            this.cdRef.detectChanges();
                        } else {
                            this.toasty.errorToast(res.message);
                        }
                    }
                });
            }
        }
    }

    public downloadVatReport() {
        let countryCode;
        let vatReportRequest = new VatReportRequest();
        vatReportRequest.from = this.fromDate;
        vatReportRequest.to = this.toDate;
        vatReportRequest.taxNumber = this.taxNumber;
        vatReportRequest.branchUniqueName = this.currentBranch?.uniqueName;

        if (this.activeCompany?.countryV2?.alpha2CountryCode === 'ZW') {
            vatReportRequest.currencyCode = this.vatReportCurrencyCode;
            countryCode = 'ZW';
        } else if (this.isKenyaCompany) {
            vatReportRequest.currencyCode = this.vatReportCurrencyCode;
            countryCode = 'KE';
        } else {
            countryCode = 'UK';
        }

        this.vatService.downloadVatReport(vatReportRequest, countryCode).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === "success") {
                let blob = this.generalService.base64ToBlob(res.body, 'application/xls', 512);
                return saveAs(blob, `VatReport${this.isKenyaCompany ? '.csv' : '.xlsx'}`);
            } else {
                this.toasty.clearAllToaster();
                this.toasty.errorToast(res?.message);
            }
        });
    }

    /**
    * This will redirect to vat report detail page
    *
    * @param {*} section
    * @memberof VatReportComponent
    */
    public viewVatReportTransactions(section) {
        this.route.navigate(['pages', 'vat-report', 'transactions', 'section', section], { queryParams: { from: this.fromDate, to: this.toDate, taxNumber: this.taxNumber } });
    }

    /**
     * Handles GST Sidebar Navigation
     *
     * @memberof VatReportComponent
     */
    public handleNavigation(): void {
        this.route.navigate(['pages', 'gstfiling']);
    }

    /**
     * This will call API to get HMRC get authorization url
     *
     * @memberof VatReportComponent
     */
    public getURLHMRCAuthorization(): void {
        this.vatService.getHMRCAuthorization(this.activeCompany.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.body) {
                this.connectToHMRCUrl = res?.body;
            }
        })
    }
}
