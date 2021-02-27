import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IOption } from '../theme/ng-select/option.interface';
import { NewVsOldInvoicesRequest, NewVsOldInvoicesResponse } from '../models/api-models/new-vs-old-invoices';
import { AppState } from '../store';
import { Store, select } from '@ngrx/store';
import { NewVsOldInvoicesActions } from '../actions/new-vs-old-invoices.actions';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { CompanyActions } from '../actions/company.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { ToasterService } from '../services/toaster.service';
import { NgForm } from '@angular/forms';
import { StateDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/Company';
import { take, takeUntil } from 'rxjs/operators';
import { SettingsFinancialYearActions } from '../actions/settings/financial-year/financial-year.action';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import * as moment from 'moment';

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
    public NewVsOldInvoicesData$: Observable<NewVsOldInvoicesResponse>;

    public yearOptions: IOption[] = [];
    public selectedYear: string;
    public NewVsOldInvoicesQueryRequest: NewVsOldInvoicesRequest;
    public columnName: string = '';
    public isRequestSuccess$: Observable<boolean>;
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
    @ViewChild('paginationChild', {static: true}) public paginationChild: ElementViewContainerRef;
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

    constructor(private store: Store<AppState>, private _NewVsOldInvoicesActions: NewVsOldInvoicesActions, private _companyActions: CompanyActions,
        private _toasty: ToasterService, private settingsFinancialYearActions: SettingsFinancialYearActions) {
        this.NewVsOldInvoicesQueryRequest = new NewVsOldInvoicesRequest();
        this.NewVsOldInvoicesData$ = this.store.pipe(select(s => s.newVsOldInvoices.data), takeUntil(this.destroyed$));
        this.isRequestSuccess$ = this.store.pipe(select(s => s.newVsOldInvoices.requestInSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.dispatch(this.settingsFinancialYearActions.getFinancialYearLimits());

        this.store.pipe(select(state => state.settings.financialYearLimits), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.startDate && response.endDate) {
                this.yearOptions = [];
                let startYear = Number(moment(response.startDate, GIDDH_DATE_FORMAT).format("YYYY"));
                let endYear = Number(moment(response.endDate, GIDDH_DATE_FORMAT).format("YYYY"));
                
                for(startYear; startYear <= endYear; startYear++) {
                    this.yearOptions.push({label: String(startYear), value: String(startYear)});
                }
            }
        });

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe(response => {
            if(response) {
                let universalEndDate = moment(response[1]).format("YYYY");

                if(moment(response[1]).toDate() >= moment().toDate()) {
                    this.selectedYear = (new Date()).getFullYear().toString();
                    this.selectedmonth = ("0" + (new Date().getMonth() + 1)).slice(-2).toString();
                    this.go();
                } else {
                    this.selectedYear = universalEndDate;                    
                    this.selectedmonth = ("0" + (moment(response[1]).format("M"))).slice(-2).toString();
                    this.go();
                }
            }
        });

        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'new-vs-old-invoices';

        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));

        this.NewVsOldInvoicesData$.subscribe(s => {
            if (s) {
                this.crdTotal = s.carriedSales.reduce((p, c) => {
                    return p + c.total;
                }, 0);
                this.invTotal = s.carriedSales.reduce((p, c) => {
                    return p + c.invoiceCount;
                }, 0);
                this.clientTotal = s.carriedSales.reduce((p, c) => {
                    return p + c.uniqueCount;
                }, 0);
                this.newSalesClientTotal = s.newSales.uniqueCount;
                this.totalSalesClientTotal = s.totalSales.uniqueCount;
                // this.clientAllTotal = this.clientTotal + this.newSalesClientTotal + this.totalSalesClientTotal;
                this.clientAllTotal = s.totalSales.uniqueCount;
                this.newSalesAmount = s.newSales.total;
                this.totalSalesAmount = s.totalSales.total;
                // this.totalAmount = this.crdTotal + this.newSalesAmount + this.totalSalesAmount;
                this.totalAmount = s.totalSales.total;
                this.newSalesInvCount = s.newSales.invoiceCount;
                this.totalSalesInvCount = s.totalSales.invoiceCount;
                // this.invoiceCountAll = this.invTotal + this.newSalesInvCount + this.totalSalesInvCount;
                this.invoiceCountAll = s.totalSales.invoiceCount;
            } else {
                this.clientAllTotal = 0;
                this.totalAmount = 0;
                this.invoiceCountAll = 0;
            }
        });
    }

    public ChangingValue(event) {
        this.selectedmonth = null;
        this.selectedQuater = null;
        this.store.dispatch(this._NewVsOldInvoicesActions.GetResponseNull());
    }

    public go(form?: NgForm) {
        // if (!this.selectedYear) {
        //   this.showErrorToast('please select year');
        //   return;
        // }
        //
        // if (!this.selectedType) {
        //   this.showErrorToast('please select type');
        //   return;
        // }
        //
        // if (this.selectedType && this.selectedType === 'month' && !(this.selectedmonth)) {
        //   this.showErrorToast('please select month');
        //   return;
        // }
        //
        // if (this.selectedType && this.selectedType === 'quater' && !(this.selectedQuater)) {
        //   this.showErrorToast('please select quater');
        //   return;
        // }
        this.isLoading = true;
        this.NewVsOldInvoicesQueryRequest.type = this.selectedType;
        if (this.NewVsOldInvoicesQueryRequest.type === 'month') {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedmonth + '-' + this.selectedYear;
        } else {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedQuater + '-' + this.selectedYear;
        }

        this.reportYear = this.selectedYear;

        this.store.dispatch(this._NewVsOldInvoicesActions.GetNewVsOldInvoicesRequest(this.NewVsOldInvoicesQueryRequest));
    }

    public showErrorToast(msg) {
        this._toasty.errorToast(msg);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public customMonthSorting(a: IOption, b: IOption) {
        return (parseInt(a.value) - parseInt(b.value));
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof NewVsOldInvoicesComponent
     */
    public translationComplete(event: boolean): void {
        if(event) {
            this.monthOptions = [{ label: this.commonLocaleData?.app_months_full.january, value: '01' }, { label: this.commonLocaleData?.app_months_full.february, value: '02' }, { label: this.commonLocaleData?.app_months_full.march, value: '03' }, { label: this.commonLocaleData?.app_months_full.april, value: '04' }, { label: this.commonLocaleData?.app_months_full.may, value: '05' }, { label: this.commonLocaleData?.app_months_full.june, value: '06' }, { label: this.commonLocaleData?.app_months_full.july, value: '07' }, { label: this.commonLocaleData?.app_months_full.august, value: '08' }, { label: this.commonLocaleData?.app_months_full.september, value: '09' }, { label: this.commonLocaleData?.app_months_full.october, value: '10' }, { label: this.commonLocaleData?.app_months_full.november, value: '11' }, { label: this.commonLocaleData?.app_months_full.december, value: '12' }];
            
            this.GetTypeOptions = [{ label: this.localeData?.get_type_options?.month, value: 'month' }, { label: this.localeData?.get_type_options?.quarter, value: 'quater' }];
            this.quaterOptions = [{ label: this.localeData?.quarters?.q1, value: '01' }, { label: this.localeData?.quarters?.q2, value: '02' }, { label: this.localeData?.quarters?.q3, value: '03' }, { label: this.localeData?.quarters?.q4, value: '04' }];

            this.isRequestSuccess$.subscribe(s => {
                if (s) {
                    this.isLoading = false;
                    if (this.NewVsOldInvoicesQueryRequest.type === 'month' && this.selectedmonth) {
                        this.columnName = this.monthOptions.find(f => f.value === this.selectedmonth)?.label;
                    } else if (this.NewVsOldInvoicesQueryRequest.type === 'quater' && this.selectedQuater) {
                        this.columnName = this.quaterOptions.find(f => f.value === this.selectedQuater)?.label;
                    }
    
                    this.bifurcationClients = this.localeData?.bifurcation_clients.replace("[COLUMN_NAME]", this.columnName);
                }
            });
        }
    }
}