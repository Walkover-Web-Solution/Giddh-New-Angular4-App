import { TaxDetail } from './../../services/purchase-invoice.service';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { CompanyService } from '../../services/companyService.service';
import { Observable } from 'rxjs/Observable';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { CompanyActions } from '../../actions/company.actions';
import { TaxResponse } from '../../models/api-models/Company';
import { SettingsTaxesActions } from '../../actions/settings/taxes/settings.taxes.action';
import { AccountService } from '../../services/account.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Select2OptionData } from '../../theme/select2';
import { IOption } from '../../theme/ng-select/ng-select';

const taxesType = [
  { label: 'GST', value: 'GST' },
  { label: 'InputGST', value: 'InputGST' },
  { label: 'Others', value: 'others' }
];

const taxDuration = [
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Quarterly', value: 'QUARTERLY' },
  { label: 'Half-Yearly', value: 'HALFYEARLY' },
  { label: 'Yearly', value: 'YEARLY' }
];

@Component({
  selector: 'setting-taxes',
  templateUrl: './setting.taxes.component.html'
})
export class SettingTaxesComponent implements OnInit {

  @ViewChild('taxConfirmationModel') public taxConfirmationModel: ModalDirective;

  public availableTaxes: TaxResponse[] = [];
  public newTaxObj: TaxResponse = new TaxResponse();
  public moment = moment;
  public days: IOption[] = [];
  public records = []; // This array is just for generating dynamic ngModel
  public taxToEdit = []; // It is for edit toogle
  public showFromDatePicker: boolean = false;
  public showDatePickerInTable: boolean = false;
  public selectedTax: string;
  public confirmationMessage: string;
  public confirmationFor: string;
  public selectedTaxForDelete: string;
  public accounts$: IOption[];
  public taxList: IOption[] = taxesType;
  public duration: IOption[] = taxDuration;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private _companyActions: CompanyActions,
    private _accountService: AccountService,
    private _settingsTaxesActions: SettingsTaxesActions,
  ) {
    for (let i = 1; i <= 31; i++) {
      let day = i.toString();
      this.days.push({ label: day, value: day });
    }

    this.store.dispatch(this._companyActions.getTax());
  }

  public ngOnInit() {
    this.store.select(p => p.company).takeUntil(this.destroyed$).subscribe((o) => {
      if (o.taxes) {
        _.map(o.taxes, (tax) => {
          _.each(tax.taxDetail, (t) => {
            t.date = moment(t.date, GIDDH_DATE_FORMAT);
          });
        });
        this.onCancel();
        this.availableTaxes = _.cloneDeep(o.taxes);
      }
    });
    this.getFlattenAccounts('');
  }

  public onSubmit(data) {
    let dataToSave = _.cloneDeep(data);
    dataToSave.taxDetail = [{
      taxValue: dataToSave.taxValue,
      date: dataToSave.date
    }];

    if (dataToSave.taxType === 'others') {
      if (!dataToSave.accounts) {
        dataToSave.accounts = [];
      }
      this.accounts$.forEach((obj) => {
        if (obj.value === dataToSave.account) {
          let accountObj = obj.label.split(' - ');
          dataToSave.accounts.push({ name: accountObj[0], uniqueName: obj.value });
        }
      });
    }

    dataToSave.date = moment(dataToSave.date).format('DD-MM-YYYY');
    dataToSave.accounts = dataToSave.accounts ? dataToSave.accounts : [];
    dataToSave.taxDetail = [{ date: dataToSave.date, taxValue: dataToSave.taxValue }];

    this.store.dispatch(this._settingsTaxesActions.CreateTax(dataToSave));
  }

  public deleteTax(taxToDelete) {
    this.newTaxObj = taxToDelete;
    this.selectedTax = this.availableTaxes.find((tax) => tax.uniqueName === taxToDelete.uniqueName).name;
    this.confirmationMessage = `Are you sure want to delete ${this.selectedTax}?`;
    this.confirmationFor = 'delete';
    this.taxConfirmationModel.show();
  }

  public updateTax(taxIndex: number) {
    let selectedTax = _.cloneDeep(this.availableTaxes[taxIndex]);
    this.newTaxObj = selectedTax;
    this.confirmationMessage = `Are you sure want to update ${selectedTax.name}?`;
    this.confirmationFor = 'edit';
    this.taxConfirmationModel.show();
  }

  public onCancel() {
    this.newTaxObj = new TaxResponse();
  }

  public userConfirmation(userResponse: boolean) {
    this.taxConfirmationModel.hide();
    if (userResponse) {
      if (this.confirmationFor === 'delete') {
        this.store.dispatch(this._settingsTaxesActions.DeleteTax(this.newTaxObj.uniqueName));
      } else if (this.confirmationFor === 'edit') {
        _.each(this.newTaxObj.taxDetail, (tax) => {
          tax.date = moment(tax.date).format(GIDDH_DATE_FORMAT);
        });
        this.store.dispatch(this._settingsTaxesActions.UpdateTax(this.newTaxObj));
      }
    }
  }

  public addMoreDateAndPercentage(taxIndex: number) {
    let taxes = _.cloneDeep(this.availableTaxes);
    taxes[taxIndex].taxDetail.push({ date: null, taxValue: null });
    this.availableTaxes = taxes;
  }

  public removeDateAndPercentage(parentIndex: number, childIndex: number) {
    let taxes = _.cloneDeep(this.availableTaxes);
    taxes[parentIndex].taxDetail.splice(childIndex, 1);
    this.availableTaxes = taxes;
  }

  public reloadTaxList() {
    this.store.select(p => p.company).take(1).subscribe((o) => {
      if (o.taxes) {
        this.onCancel();
        this.availableTaxes = _.cloneDeep(o.taxes);
      }
    });
  }
  /**
   *
   */
  public getFlattenAccounts(value) {
    let count = '5';
    let query = value || '';
    // get flattern accounts
    this._accountService.GetFlattenAccounts(query, '', count).debounceTime(100).takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: IOption[] = [];
        data.body.results.map(d => {
          accounts.push({ label: `${d.name} - (${d.uniqueName})`, value: d.uniqueName });
          // `${d.name} (${d.uniqueName})`
        });
        this.accounts$ = accounts;
    }});
  }

  public customDateSorting(a: IOption, b: IOption) {
    return (parseInt(a.label) - parseInt(b.label));
  }

}
