import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOption } from '../../theme/ng-select/option.interface';
import { TaxResponse } from '../../models/api-models/Company';
import { ReplaySubject } from 'rxjs';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { SettingsTaxesActions } from '../../actions/settings/taxes/settings.taxes.action';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'aside-menu-create-tax-component',
  templateUrl: './aside-menu-create-tax.component.html',
  styleUrls: [`./aside-menu-create-tax.component.scss`]
})

export class AsideMenuCreateTaxComponent implements OnInit, OnChanges {
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
  @Input() public tax: TaxResponse;

  public taxList: IOption[] = [
    {label: 'GST', value: 'gst'},
    {label: 'COMMONGST', value: 'commongst'},
    {label: 'InputGST', value: 'inputgst'},
    {label: 'VAT', value: 'vat'},
    {label: 'TDS', value: 'tds'},
    {label: 'TCS', value: 'tcs'},
    {label: 'CESS', value: 'gstcess'},
    {label: 'Others', value: 'others'},

  ];
  public duration: IOption[] = [
    {label: 'Monthly', value: 'MONTHLY'},
    {label: 'Quarterly', value: 'QUARTERLY'},
    {label: 'Half-Yearly', value: 'HALFYEARLY'},
    {label: 'Yearly', value: 'YEARLY'}
  ];
  public tdsTcsTaxSubTypes: IOption[] = [
    {label: 'Receivable', value: 'receivable'},
    {label: 'Payable', value: 'payable'}
  ];
  public allTaxes: IOption[] = [];

  public days: IOption[] = [];
  public newTaxObj: TaxResponse = new TaxResponse();
  public flattenAccountsOptions: IOption[] = [];
  public isTaxCreateInProcess: boolean = false;
  public isUpdateTaxInProcess: boolean = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _settingsTaxesActions: SettingsTaxesActions, private _toaster: ToasterService) {
    for (let i = 1; i <= 31; i++) {
      this.days.push({label: i.toString(), value: i.toString()});
    }
    this.newTaxObj.date = moment().toDate();
  }

  ngOnInit() {
    this.store
      .pipe(select(p => p.general.flattenAccounts), takeUntil(this.destroyed$))
      .subscribe(data => {
        if (data && data.length) {
          let arr: IOption[] = [];
          data.forEach(f => {
            arr.push({label: `${f.name} - (${f.uniqueName})`, value: f.uniqueName});
          });
          this.flattenAccountsOptions = arr;
        }
      });

    this.store
      .pipe(select(p => p.company.taxes), takeUntil(this.destroyed$))
      .subscribe(taxes => {
        if (taxes && taxes.length) {
          let arr: IOption[] = [];
          taxes.forEach(tax => {
            arr.push({label: tax.name, value: tax.uniqueName});
          });
          this.allTaxes = arr;
        }
      });

    this.store
      .pipe(select(p => p.company.isTaxCreationInProcess), takeUntil(this.destroyed$))
      .subscribe(result => this.isTaxCreateInProcess = result);
    this.store
      .pipe(select(p => p.company.isTaxUpdatingInProcess), takeUntil(this.destroyed$))
      .subscribe(result => this.isUpdateTaxInProcess = result);

    this.store
      .pipe(select(p => p.company.isTaxCreatedSuccessfully), takeUntil(this.destroyed$))
      .subscribe(result => {
        if (result) {
          this.closeEvent.emit(true);
        }
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('tax' in changes && changes.tax.currentValue && (changes.tax.currentValue !== changes.tax.previousValue)) {
      this.newTaxObj = {...this.tax, taxValue: this.tax.taxDetail[0].taxValue, date: moment(this.tax.taxDetail[0].date).toDate()};
    }
  }

  public customAccountFilter(term: string, item: IOption) {
    return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
  }

  public customDateSorting(a: IOption, b: IOption) {
    return (parseInt(a.label) - parseInt(b.label));
  }

  public onSubmit() {
    let dataToSave = _.cloneDeep(this.newTaxObj);

    if (dataToSave.taxType === 'tcs' || dataToSave.taxType === 'tds') {
      if (dataToSave.tdsTcsTaxSubTypes === 'receivable') {
        dataToSave.taxType = `${dataToSave.taxType}rc`;
      } else {
        dataToSave.taxType = `${dataToSave.taxType}pay`;
      }
    }

    dataToSave.taxDetail = [{
      taxValue: dataToSave.taxValue,
      date: dataToSave.date
    }];

    if (dataToSave.taxType === 'others') {
      if (!dataToSave.accounts) {
        dataToSave.accounts = [];
      }
      this.flattenAccountsOptions.forEach((obj) => {
        if (obj.value === dataToSave.account) {
          let accountObj = obj.label.split(' - ');
          dataToSave.accounts.push({name: accountObj[0], uniqueName: obj.value});
        }
      });
    }

    dataToSave.date = moment(dataToSave.date).format('DD-MM-YYYY');
    dataToSave.accounts = dataToSave.accounts ? dataToSave.accounts : [];
    dataToSave.taxDetail = [{date: dataToSave.date, taxValue: dataToSave.taxValue}];
    if (dataToSave.duration) {
      this.store.dispatch(this._settingsTaxesActions.CreateTax(dataToSave));
    } else {
      this._toaster.errorToast('Please select tax duration.', 'Validation');
    }
  }
}
