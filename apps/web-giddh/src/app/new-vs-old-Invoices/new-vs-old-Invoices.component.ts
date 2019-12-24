import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IOption } from '../theme/ng-select/option.interface';
import { NewVsOldInvoicesRequest, NewVsOldInvoicesResponse } from '../models/api-models/new-vs-old-invoices';
import { AppState } from '../store';
import { Store } from '@ngrx/store';
import { NewVsOldInvoicesActions } from '../actions/new-vs-old-invoices.actions';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { CompanyActions } from '../actions/company.actions';
import { Observable } from 'rxjs';
import { ToasterService } from '../services/toaster.service';
import { NgForm } from '@angular/forms';
import { StateDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/Company';
import { take } from 'rxjs/operators';

@Component({
    selector: 'new-vs-old-invoices',
    templateUrl: './new-vs-old-Invoices.component.html',
    styles: [`
    .h-25px {
      height: 25px;
    }

    .pad-8 {
      padding: 8px;
    }

    .divTable {
      display: table;
      width: 50%;
      background-color: white;
      padding: 15px 30px;
    }

    .h3-heading {
      text-align: center;
      margin: 20px 0;
      font-weight: bold;
      font-size: 20px;
    }

    .divRow {
      display: flex;
      margin-top: 10px;
      width: auto;
    }

    .headRow {
      display: flex;
    }

    .divCell {
      float: left;
      display: table-column;
      width: 150px;
      background-color: #ffffff00;
      font-size: 14px;
    }

    .align-end {
      text-align: end;
    }
  `]
})

export class NewVsOldInvoicesComponent implements OnInit, OnDestroy {
    public GetTypeOptions: IOption[] = [{ label: 'Month', value: 'month' }, { label: 'Quater', value: 'quater' }];
    public selectedType: string;
    public monthOptions: IOption[] = [{ label: 'January', value: '01' }, { label: 'February', value: '02' }, { label: 'March', value: '03' }, { label: 'April', value: '04' }, { label: 'May', value: '05' }, { label: 'June', value: '06' }, { label: 'July', value: '07' }, { label: 'August', value: '08' }, { label: 'September', value: '09' }, { label: 'October', value: '10' }, { label: 'November', value: '11' }, { label: 'December', value: '12' }];
    public selectedmonth: string;
    public quaterOptions: IOption[] = [{ label: 'Q1', value: '01' }, { label: 'Q2', value: '02' }, { label: 'Q3', value: '03' }, { label: 'Q4', value: '04' }];
    public selectedQuater: string = '';
    public NewVsOldInvoicesData$: Observable<NewVsOldInvoicesResponse>;

    public yearOptions: IOption[] = [{ label: '2014', value: '2014' }, { label: '2015', value: '2015' }, { label: '2016', value: '2016' }, { label: '2017', value: '2017' }, { label: '2018', value: '2018' }, { label: '2019', value: '2019' }, { label: '2020', value: '2020' }];
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
    @ViewChild('paginationChild') public paginationChild: ElementViewContainerRef;
    private searchFilterData: any = null;

    constructor(private store: Store<AppState>, private _NewVsOldInvoicesActions: NewVsOldInvoicesActions,
        private componentFactoryResolver: ComponentFactoryResolver, private _companyActions: CompanyActions,
        private _toasty: ToasterService) {
        this.NewVsOldInvoicesQueryRequest = new NewVsOldInvoicesRequest();
        this.NewVsOldInvoicesData$ = this.store.select(s => s.newVsOldInvoices.data);
        this.isRequestSuccess$ = this.store.select(s => s.newVsOldInvoices.requestInSuccess);
    }

    public ngOnInit() {
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'new-vs-old-invoices';

        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));

        this.isRequestSuccess$.subscribe(s => {
            if (s) {
                if (this.NewVsOldInvoicesQueryRequest.type === 'month' && this.selectedmonth) {
                    this.columnName = this.monthOptions.find(f => f.value === this.selectedmonth).label;
                } else if (this.NewVsOldInvoicesQueryRequest.type === 'quater' && this.selectedQuater) {
                    this.columnName = this.quaterOptions.find(f => f.value === this.selectedQuater).label;
                }
            }
        });

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

        this.selectedYear = (new Date()).getFullYear().toString();
    }

    public ChangingValue(event) {
        this.selectedmonth = null;
        this.selectedQuater = null;
        this.store.dispatch(this._NewVsOldInvoicesActions.GetResponseNull());
    }

    public go(form: NgForm) {
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
        this.NewVsOldInvoicesQueryRequest.type = this.selectedType;
        if (this.NewVsOldInvoicesQueryRequest.type === 'month') {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedmonth + '-' + this.selectedYear;
        } else {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedQuater + '-' + this.selectedYear;
        }

        this.store.dispatch(this._NewVsOldInvoicesActions.GetNewVsOldInvoicesRequest(this.NewVsOldInvoicesQueryRequest));
    }

    public showErrorToast(msg) {
        this._toasty.errorToast(msg);
    }

    public ngOnDestroy() {
        //
    }

    public customMonthSorting(a: IOption, b: IOption) {
        return (parseInt(a.value) - parseInt(b.value));
    }
}
