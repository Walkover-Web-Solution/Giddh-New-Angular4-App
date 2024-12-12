import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../../store';
import { CompanyResponse } from '../../models/api-models/Company';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import * as dayjs from 'dayjs';
import { GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { FinancialReportsComponentStore } from '../financial-report.store';

@Component({
    selector: 'multi-currency',
    templateUrl: './multi-currency-report.component.html',
    styleUrls: ['./multi-currency-report.component.scss'],
    providers: [FinancialReportsComponentStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MultiCurrencyReportComponent implements OnInit, OnDestroy {
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if current organization is company */
    public isCompanyMode: boolean;
    /** Holds company List */
    public companyList: any[] = [];
    /** Holds company List */
    public currencyList: any[] = [];
    /** Holds Tax Number List */
    public taxesList: any;
    /** This will store selected date ranges */
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Instance of bootstrap modal */
    public modalRef: BsModalRef;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    // /** Observable to store the data source of Liability Payment */
    // public liabilityPaymentList$: Observable<any> = this.componentStore.select(state => state.liabilityPaymentList);
    // /** Observable to store the Tax Number */
    // public taxNumber$: Observable<any> = this.componentStore.select(state => state.taxNumber);
    /** Holds true if multiple branches in the company */
    public isMultipleBranch: boolean;
    /** Holds Liabilities Payment Formgroup  */
    public searchForm: FormGroup;
    /** Holds table data source */
    public dataSource: any[] = [];
    /** Holds Payment table columns */
    public paymentColumns: string[] = ["index", "received", "amount"];
    /** Holds Liability table columns */
    public liabilityColumns: string[] = ["index", "from", "to", "originalAmount", "outstandingAmount", "type", "due"];
    /** Holds current table columns */
    public displayColumns: string[] = [];
    /** Holds true if user in vat-payment */
    public isPaymentMode: boolean;
    /** Stores the current company */
    public activeCompany: any = {};
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** True if current company or branch has tax number */
    public hasTaxNumber: boolean = false;
    /** Holds current branch information */
    private currentBranch: any = {};
    /** Hold true in production environment */
    public isProdMode: boolean = PRODUCTION_ENV;
    /** Hold HMRC portal url */
    public connectToHMRCUrl: string = null;
    /** True if API Call is in progress */
    public isLoading: boolean;


    constructor(
        private store: Store<AppState>,
        private componentStore: FinancialReportsComponentStore,
        private generalService: GeneralService,
        private modalService: BsModalService,
        private breakPointObservar: BreakpointObserver) {
        // this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
        //     if (activeCompany) {
        //         this.selectedCompany = activeCompany;
        //     }
        // });
    }

    /**
     * This will return page heading based on active tab
     *
     * @param {boolean} event
     * @memberof InvoiceComponent
     */
    //  public getPageHeading(): string {
    //     if(this.isMobileScreen){
    //         if(this.CanTBLoad) {
    //             return this.localeData?.tabs?.trial_balance;
    //         }
    //         else if(this.CanPLLoad) {
    //             return this.localeData?.tabs?.profit_loss;
    //         }
    //         else if(this.CanBSLoad) {
    //             return this.localeData?.tabs?.balance_sheet;
    //         }
    //     }
    //     else {
    //         return " ";
    //     }
    // }

    public ngOnInit() {
this.getUniversalDatePickerDate();

        // this.breakPointObservar.observe([
        //     '(max-width: 767px)'
        // ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
        //     this.isMobileScreen = result.matches;
        // });

        // if (TEST_ENV) {
        //     this.CanNewTBLoadOnThisEnv = true;
        // } else {
        //     this.CanNewTBLoadOnThisEnv = false;
        // }

        // this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
        //     if (val && val.tab && val.tabIndex) {
        //         this.activeTab = val.tab;
        //         this.activeTabIndex = val.tabIndex;
        //         this.preventTabChangeWithRoute = true;
        //         this.selectTab(val.tabIndex);
        //     }
        // });
    }

    // public selectTab(id: number) {
    //     if (this.staticTabs && this.staticTabs.tabs && this.staticTabs.tabs[id]) {
    //         this.staticTabs.tabs[id].active = true;
    //     }
    // }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof FinancialReportsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public companySelected(event: any) {

    }
    public currencySelected(event: any) {

    }
    public getCompany() {

    }
    /**
* This will be use for show datepicker
*
* @param {*} element
* @memberof VatLiabilitiesPayments
*/
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /**
* Call back function for date/range selection in datepicker
*
* @param {*} value
* @memberof VatLiabilitiesPayments
*/
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);

        }
    }

        /**
    * Get Universal Date Observable from Store and subscribed
    *
    * @private
    * @memberof VatLiabilitiesPayments
    */
        private getUniversalDatePickerDate(): void {
            this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe((dateObj) => {
                if (dateObj) {
                    this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                    this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                }
            });
        }

    /**
* This will be use for hide datepicker
*
* @memberof VatLiabilitiesPayments
*/
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    // /**
    //  * This will navigate to selected tab
    //  *
    //  * @param {string} tab
    //  * @param {number} tabIndex
    //  * @memberof FinancialReportsComponent
    //  */
    // public tabChanged(tab: string, tabIndex: number): void {
    //     if (!this.preventTabChangeWithRoute) {
    //         this.router.navigate(['/pages/trial-balance-and-profit-loss'], { queryParams: { tab, tabIndex } });
    //     }
    // }
}
