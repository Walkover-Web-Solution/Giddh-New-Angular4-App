import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewVsOldInvoicesRequest, NewVsOldInvoicesResponse } from '../models/api-models/new-vs-old-invoices';
import { AppState } from '../store';
import { Store, select } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from '../services/toaster.service';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { SettingsFinancialYearActions } from '../actions/settings/financial-year/financial-year.action';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { NewVsOldInvoicesService } from '../services/new-vs-old-invoices.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalesBifurcationDetailsComponent } from './sales-bifurcation-details/sales-bifurcation-details.component';
import { ASIDE_PANE_CONFIG, GetBifurcationType, IOption } from '../app.constant';
import { GeneralService } from '../services/general.service';

@Component({
    selector: 'new-vs-old-invoices',
    templateUrl: './new-vs-old-Invoices.component.html',
    styleUrls: [`./new-vs-old-Invoices.component.scss`],
})

export class NewVsOldInvoicesComponent implements OnInit, OnDestroy {
    public GetTypeOptions: IOption[] = [];
    public selectedType: string = "month";
    public monthOptions: IOption[] = [];
    public selectedmonth: string;
    public quaterOptions: IOption[] = [];
    public selectedQuater: string = '';
    public newVsOldInvoicesData: NewVsOldInvoicesResponse;
    public yearOptions: IOption[] = [];
    public selectedYear: string;
    public NewVsOldInvoicesQueryRequest: NewVsOldInvoicesRequest;
    public columnName: string = '';
    public newSalesClientTotal: number = 0;
    public totalSalesClientTotal: number = 0;
    public newSalesAmount: number = 0;
    public totalSalesAmount: number = 0;
    public newSalesInvCount: number = 0;
    public totalSalesInvCount: number = 0;
    public invoiceCountAll: number = 0;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if api call in progress */
    public isLoading: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold bifurcation of clients content */
    public bifurcationClients: string = "";
    /** This will hold report year */
    public reportYear: string;
    /** Delete attached file dialog ref */
    public salesBifurcationDetailsDialogRef: MatDialogRef<any>;
    /** Selected type enum */
    public selectedTypeEnum: any = GetBifurcationType;

    constructor(
        private store: Store<AppState>,
        private toaster: ToasterService,
        private settingsFinancialYearActions: SettingsFinancialYearActions,
        private newVsOldInvoicesService: NewVsOldInvoicesService,
        private dialog: MatDialog,
        private generalService: GeneralService
    ) {
        this.NewVsOldInvoicesQueryRequest = new NewVsOldInvoicesRequest();
    }

    public ngOnInit() {
        this.store.dispatch(this.settingsFinancialYearActions.getFinancialYearLimits());

        this.store.pipe(select(state => state.settings.financialYearLimits), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.startDate && response.endDate) {
                this.yearOptions = [];
                let startYear = Number(dayjs(response.startDate, GIDDH_DATE_FORMAT).format("YYYY"));
                let endYear = Number(dayjs(response.endDate, GIDDH_DATE_FORMAT).format("YYYY"));

                for (startYear; startYear <= endYear; startYear++) {
                    this.yearOptions.push({ label: String(startYear), value: String(startYear) });
                }
            }
        });

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let universalEndDate = dayjs(response[1]).format("YYYY");

                if (dayjs(response[1]).toDate() >= dayjs().toDate()) {
                    this.selectedYear = (new Date()).getFullYear()?.toString();
                    this.selectedmonth = ("0" + (new Date().getMonth() + 1)).slice(-2)?.toString();
                    this.getSalesBifurcation();
                } else {
                    this.selectedYear = universalEndDate;
                    this.selectedmonth = ("0" + (dayjs(response[1]).format("M"))).slice(-2)?.toString();
                    this.getSalesBifurcation();
                }
            }
        });
    }

    /**
     * This will reset the data
     *
     * @memberof NewVsOldInvoicesComponent
     */
    public resetData(): void {
        this.selectedmonth = null;
        this.selectedQuater = null;
        this.newVsOldInvoicesData = {
            totalSales: {
                invoiceCount: null,
                total: null,
                month: '',
                uniqueCount: null,
                fromDate: null,
                toDate: null
            },
            newSales: {
                invoiceCount: null,
                total: null,
                month: '',
                uniqueCount: null,
                fromDate: null,
                toDate: null
            },
            oldSales: {
                invoiceCount: null,
                total: null,
                month: '',
                uniqueCount: null,
                uniqueNames: [],
                fromDate: null,
                toDate: null
            },
            carriedSales: []
        };
    }

    /**
     * This will get sales bifurcation report
     *
     * @memberof NewVsOldInvoicesComponent
     */
    public getSalesBifurcation(): void {
        this.isLoading = true;
        this.NewVsOldInvoicesQueryRequest.type = this.selectedType;
        if (this.NewVsOldInvoicesQueryRequest.type === GetBifurcationType.MONTH) {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedmonth + '-' + this.selectedYear;
        } else {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedQuater + '-' + this.selectedYear;
        }

        this.reportYear = this.selectedYear;

        this.newVsOldInvoicesService.GetNewVsOldInvoices(this.NewVsOldInvoicesQueryRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body) {
                this.newVsOldInvoicesData = response?.body;
                this.newSalesClientTotal = this.newVsOldInvoicesData?.newSales?.uniqueCount;
                this.totalSalesClientTotal = this.newVsOldInvoicesData?.totalSales?.uniqueCount;
                this.newSalesAmount = this.newVsOldInvoicesData?.newSales?.total;
                this.totalSalesAmount = this.newVsOldInvoicesData?.totalSales?.total;
                this.newSalesInvCount = this.newVsOldInvoicesData?.newSales?.invoiceCount;
                this.totalSalesInvCount = this.newVsOldInvoicesData?.totalSales?.invoiceCount;
            }
            this.isLoading = false;

            this.getBifurcationClientsString();
        });
    }

    public showErrorToast(msg) {
        this.toaster.errorToast(msg);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public customMonthSorting(a: IOption, b: IOption) {
        return (parseInt(a?.value) - parseInt(b?.value));
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof NewVsOldInvoicesComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.monthOptions = [{ label: this.commonLocaleData?.app_months_full.january, value: '01' }, { label: this.commonLocaleData?.app_months_full.february, value: '02' }, { label: this.commonLocaleData?.app_months_full.march, value: '03' }, { label: this.commonLocaleData?.app_months_full.april, value: '04' }, { label: this.commonLocaleData?.app_months_full.may, value: '05' }, { label: this.commonLocaleData?.app_months_full.june, value: '06' }, { label: this.commonLocaleData?.app_months_full.july, value: '07' }, { label: this.commonLocaleData?.app_months_full.august, value: '08' }, { label: this.commonLocaleData?.app_months_full.september, value: '09' }, { label: this.commonLocaleData?.app_months_full.october, value: '10' }, { label: this.commonLocaleData?.app_months_full.november, value: '11' }, { label: this.commonLocaleData?.app_months_full.december, value: '12' }];

            this.GetTypeOptions = [{ label: this.localeData?.get_type_options?.month, value: GetBifurcationType.MONTH }, { label: this.localeData?.get_type_options?.quarter, value: GetBifurcationType.QUATER }];
            this.quaterOptions = [{ label: this.localeData?.quarters?.q1, value: '01' }, { label: this.localeData?.quarters?.q2, value: '02' }, { label: this.localeData?.quarters?.q3, value: '03' }, { label: this.localeData?.quarters?.q4, value: '04' }];

            this.getBifurcationClientsString();
        }
    }

    /**
     * This will set bifurcation clients string
     *
     * @memberof NewVsOldInvoicesComponent
     */
    public getBifurcationClientsString(): void {
        if (this.NewVsOldInvoicesQueryRequest.type === GetBifurcationType.MONTH && this.selectedmonth) {
            this.columnName = this.monthOptions.find(f => f?.value === this.selectedmonth)?.label;
        } else if (this.NewVsOldInvoicesQueryRequest.type === GetBifurcationType.QUATER && this.selectedQuater) {
            this.columnName = this.quaterOptions.find(f => f?.value === this.selectedQuater)?.label;
        }

        if (this.columnName) {
            this.bifurcationClients = this.localeData?.bifurcation_clients?.replace("[COLUMN_NAME]", this.columnName);
        }
    }

    /**
     * This will show client list
     *
     * @param {any} newVsOldInvoicesData
     * @param {string} type
     * @param {string} subType
     * @param {string} salesFrom
     * @memberof NewVsOldInvoicesComponent
     */
    public showClientList(newVsOldInvoicesData: any, type: string, subType: string, salesFrom: string): void {
        const goToLedgerDateRange = this.generalService.getStartAndEndDateOfMonthOrQuater(this.NewVsOldInvoicesQueryRequest.type === GetBifurcationType.QUATER ? GetBifurcationType.QUARTER : GetBifurcationType.MONTH, this.NewVsOldInvoicesQueryRequest.value);
        const reportType = this.NewVsOldInvoicesQueryRequest.type == GetBifurcationType.QUATER ? GetBifurcationType.QUARTER : GetBifurcationType.MONTH;
        const reportReq = {
            type: reportType,
            value: this.NewVsOldInvoicesQueryRequest.value,
            fromDate: goToLedgerDateRange.fromDate,
            toDate: goToLedgerDateRange.toDate
        }
        const data = {
            newVsOldInvoicesData,
            type,
            subType,
            salesFrom,
            newVsOldInvoicesQueryRequest: reportReq
        };
        ASIDE_PANE_CONFIG.data = data;
        this.salesBifurcationDetailsDialogRef = this.dialog.open(SalesBifurcationDetailsComponent, ASIDE_PANE_CONFIG);
        this.salesBifurcationDetailsDialogRef.afterClosed().pipe(take(1), filter(Boolean), tap(() => {
            this.getSalesBifurcation(); this.salesBifurcationDetailsDialogRef = undefined;
        })).subscribe();
    }
}