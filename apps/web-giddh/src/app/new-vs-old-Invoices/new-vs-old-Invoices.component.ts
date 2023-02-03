import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IOption } from '../theme/ng-select/option.interface';
import { NewVsOldInvoicesRequest, NewVsOldInvoicesResponse } from '../models/api-models/new-vs-old-invoices';
import { AppState } from '../store';
import { Store, select } from '@ngrx/store';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from '../services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { SettingsFinancialYearActions } from '../actions/settings/financial-year/financial-year.action';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { NewVsOldInvoicesService } from '../services/new-vs-old-invoices.service';

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
    public crdTotal: number = 0;
    public invTotal: number = 0;
    public clientTotal: number = 0;
    public newSalesClientTotal: number = 0;
    public totalSalesClientTotal: number = 0;
    public clientAllTotal: number = 0;
    public newSalesAmount: number = 0;
    public totalSalesAmount: number = 0;
    public totalAmount: number = 0;
    public newSalesInvCount: number = 0;
    public totalSalesInvCount: number = 0;
    public invoiceCountAll: number = 0;
    @ViewChild('paginationChild', { static: true }) public paginationChild: ElementViewContainerRef;
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

    constructor(
        private store: Store<AppState>,
        private toaster: ToasterService,
        private settingsFinancialYearActions: SettingsFinancialYearActions,
        private newVsOldInvoicesService: NewVsOldInvoicesService
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
        this.clientAllTotal = 0;
        this.totalAmount = 0;
        this.invoiceCountAll = 0;
        this.newVsOldInvoicesData = {
            totalSales: {
                invoiceCount: null,
                total: null,
                month: '',
                uniqueCount: null
            },
            newSales: {
                invoiceCount: null,
                total: null,
                month: '',
                uniqueCount: null
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
        if (this.NewVsOldInvoicesQueryRequest.type === 'month') {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedmonth + '-' + this.selectedYear;
        } else {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedQuater + '-' + this.selectedYear;
        }

        this.reportYear = this.selectedYear;

        this.newVsOldInvoicesService.GetNewVsOldInvoices(this.NewVsOldInvoicesQueryRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if(response?.status === "success" && response?.body) {
                this.newVsOldInvoicesData = response?.body;

                this.crdTotal = 0;
                this.invTotal = 0;
                this.clientTotal = 0;

                this.newVsOldInvoicesData.carriedSales?.forEach((sale) => {
                    this.crdTotal += sale.total;
                    this.invTotal += sale.invoiceCount;
                    this.clientTotal += sale.uniqueCount;
                });

                this.newSalesClientTotal = this.newVsOldInvoicesData?.newSales?.uniqueCount;
                this.totalSalesClientTotal = this.newVsOldInvoicesData?.totalSales?.uniqueCount;
                this.clientAllTotal = this.newVsOldInvoicesData?.totalSales?.uniqueCount;
                this.newSalesAmount = this.newVsOldInvoicesData?.newSales?.total;
                this.totalSalesAmount = this.newVsOldInvoicesData?.totalSales?.total;
                this.totalAmount = this.newVsOldInvoicesData?.totalSales?.total;
                this.newSalesInvCount = this.newVsOldInvoicesData?.newSales?.invoiceCount;
                this.totalSalesInvCount = this.newVsOldInvoicesData?.totalSales?.invoiceCount;
                this.invoiceCountAll = this.newVsOldInvoicesData?.totalSales?.invoiceCount;
            } else {
                this.clientAllTotal = 0;
                this.totalAmount = 0;
                this.invoiceCountAll = 0;
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

            this.GetTypeOptions = [{ label: this.localeData?.get_type_options?.month, value: 'month' }, { label: this.localeData?.get_type_options?.quarter, value: 'quater' }];
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
        if (this.NewVsOldInvoicesQueryRequest.type === 'month' && this.selectedmonth) {
            this.columnName = this.monthOptions.find(f => f?.value === this.selectedmonth)?.label;
        } else if (this.NewVsOldInvoicesQueryRequest.type === 'quater' && this.selectedQuater) {
            this.columnName = this.quaterOptions.find(f => f?.value === this.selectedQuater)?.label;
        }

        if(this.columnName) {
            this.bifurcationClients = this.localeData?.bifurcation_clients?.replace("[COLUMN_NAME]", this.columnName);
        }
    }
}
