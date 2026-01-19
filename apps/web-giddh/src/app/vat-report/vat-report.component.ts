import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VatReportRequest } from '../models/api-models/Vat';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { VatService } from "../services/vat.service";
import { saveAs } from "file-saver";
import { SettingsFinancialYearService } from '../services/settings.financial-year.service';
import { RestrictedModules } from '../app.constant';
/**
 * Handles Component functionality
 */
@Component({
    selector: 'app-vat-report',
    styleUrls: ['./vat-report.component.scss'],
    templateUrl: './vat-report.component.html',
    standalone:false
})
/**
 * VatReportComponent component
 * Handles vatreport functionality and user interactions
 */
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
    /** This will hold the boolean value to open/close setting sidebar popup */
    public asideGstSidebarMenuState: boolean = true;
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
    /** Enum for restricted modules */
    public restrictedModules: any = RestrictedModules;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private vatService: VatService,
        private generalService: GeneralService,
        private toasty: ToasterService,
        private cdRef: ChangeDetectorRef,
        private route: Router,
        public settingsFinancialYearService: SettingsFinancialYearService
    ) { }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            /**
             * Handles if functionality
             */
            if (activeCompany && this.activeCompany?.uniqueName !== activeCompany.uniqueName) {
                this.activeCompany = activeCompany;
                this.isUKCompany = this.activeCompany?.countryV2?.alpha2CountryCode === 'GB';
                this.isZimbabweCompany = this.activeCompany?.countryV2?.alpha2CountryCode === 'ZW';
                this.isKenyaCompany = this.activeCompany?.countryV2?.alpha2CountryCode === 'KE';
                /**
                 * Handles if functionality
                 */
                if (this.isUKCompany && !this.activeCompany?.subscription?.planDetails?.restrictedModules.hasOwnProperty(this.restrictedModules.TaxFilling)) {
                    this.getURLHMRCAuthorization();
                }
            }
        });
        document.querySelector('body').classList.add('gst-sidebar-open');
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState = false;
    }

    /**
     * This will use for get vat report for uae and uk according to country code
     *
     * @memberof VatReportComponent
     */
    public getVatReport(): void {
        /**
         * Handles if functionality
         */
        if (this.taxNumber) {
            let countryCode;
            let vatReportRequest = new VatReportRequest();
            vatReportRequest.from = this.fromDate;
            vatReportRequest.to = this.toDate;
            vatReportRequest.taxNumber = this.taxNumber;
            vatReportRequest.branchUniqueName = this.currentBranch?.uniqueName;

            /**
             * Handles if functionality
             */
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

            /**
             * Handles if functionality
             */
            if (!this.isUKCompany && !this.isZimbabweCompany && !this.isKenyaCompany) {
                this.vatService.getVatReport(vatReportRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    /**
                     * Handles if functionality
                     */
                    if (res) {
                        this.isLoading = false;
                        /**
                         * Handles if functionality
                         */
                        if (res.status === 'success') {
                            this.vatReport = res.body?.sections;
                            this.cdRef.detectChanges();
                        } else {
                            this.toasty.showSnackBar('error', res.message);
                        }
                    }
                });
            } else {
                this.vatService.getCountryWiseVatReport(vatReportRequest, countryCode).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    /**
                     * Handles if functionality
                     */
                    if (res) {
                        this.isLoading = false;
                        /**
                         * Handles if functionality
                         */
                        if (res && res?.status === 'success' && res?.body) {
                            this.vatReport = res.body?.sections;
                            /**
                             * Handles if functionality
                             */
                            if (this.isZimbabweCompany) {
                                this.vatReportCurrencyMap = res.body?.currencyMap;
                                this.vatReportCurrencySymbol = res.body?.currency?.symbol;
                            }

                            this.cdRef.detectChanges();
                        } else {
                            this.toasty.showSnackBar('error', res.message);
                        }
                    }
                });
            }
        }
    }

    /**
     * Handles downloadVatReport functionality
     */
    public downloadVatReport() {
        let countryCode;
        let vatReportRequest = new VatReportRequest();
        vatReportRequest.from = this.fromDate;
        vatReportRequest.to = this.toDate;
        vatReportRequest.taxNumber = this.taxNumber;
        vatReportRequest.branchUniqueName = this.currentBranch?.uniqueName;

        /**
         * Handles if functionality
         */
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
            /**
             * Handles if functionality
             */
            if (res?.status === "success") {
                let blob = this.generalService.base64ToBlob(res.body.data, 'application/xls', 512);
                return saveAs(blob, res.body.name);
            } else {
                this.toasty.clearAllToaster();
                this.toasty.showSnackBar('error', res?.message);
            }
        });
    }

    /**
    * This will redirect to vat report detail page
    *
    * @param {*} section
    * @memberof VatReportComponent
    */
    public viewVatReportTransactions(section: string) {
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
            /**
             * Handles if functionality
             */
            if (res?.body) {
                this.connectToHMRCUrl = res?.body;
            }
        })
    }
}
