import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { SettingsProfileActions } from '../../services/actions/settings/profile/settings.profile.action';
import { CompanyService } from '../../services/companyService.service';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CompanyActions } from '../../services/actions/company.actions';
import { TaxResponse } from '../../models/api-models/Company';
import { SettingsTaxesActions } from '../../services/actions/settings/taxes/settings.taxes.action';
import { AccountService } from '../../services/account.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'setting-taxes',
  templateUrl: './setting.taxes.component.html'
})
export class SettingTaxesComponent implements OnInit {

  @ViewChild('taxConfirmationModel') public taxConfirmationModel: ModalDirective;

  public availableTaxes: TaxResponse[] = [];
  public newTaxObj: any = {};
  public moment = moment;
  public days: number[] = [];
  public records = [];
  public taxToEdit = [];
  public showFromDatePicker: boolean = false;
  public isUpdateCondition: boolean = false;
  public selectedTaxForDelete: string;
  public accounts$: Select2OptionData[];
  public statesSource$: Observable<Select2OptionData[]> = Observable.of([]);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private _companyActions: CompanyActions,
    private _accountService: AccountService,
    private _settingsTaxesActions: SettingsTaxesActions,
  ) {
    for (let i = 1; i <= 31; i++) {
      this.days.push(i);
    }

    this.store.dispatch(this._companyActions.getTax());
  }

  public ngOnInit() {
    this.store.select(p => p.company).takeUntil(this.destroyed$).subscribe((o) => {
      if (o.taxes) {
        this.onCancel();
        this.availableTaxes = _.cloneDeep(o.taxes);
      }
    });
    console.log('hello from SettingTaxesComponent');

    // get flatternaccounts
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: Select2OptionData[] = [];
        data.body.results.map(d => {
          accounts.push({text: `${d.name} (${d.uniqueName})`, id: d.uniqueName});
        });
        this.accounts$ = accounts;
      }
    });

  }

  private onSubmit(data) {
    let dataToSave = _.cloneDeep(data);
    dataToSave.taxDetail = [{
      taxValue: dataToSave.taxValue,
      date: dataToSave.date
    }];

    if (dataToSave.taxType === 'others') {
      this.accounts$.forEach((obj) => {
        if (obj.id === dataToSave.account) {
          dataToSave.accounts.push({ name: obj.text, uniqueName: obj.id });
        }
      });
    }

    dataToSave.date = moment(dataToSave.date).format('DD-MM-YYYY');
    dataToSave.accounts = dataToSave.accounts ? dataToSave.accounts : [];
    dataToSave.taxDetail = [{ date: dataToSave.date , taxValue: dataToSave.taxValue}];

    if (!this.isUpdateCondition) { // create
      this.store.dispatch(this._settingsTaxesActions.CreateTax(dataToSave));
    } else { // Update
      this.store.dispatch(this._settingsTaxesActions.UpdateTax(dataToSave));
    }
  }

  private deleteTax(taxUniqueName) {
    this.newTaxObj.uniqueName = taxUniqueName;
    this.selectedTaxForDelete = this.availableTaxes.find((tax) => tax.uniqueName === taxUniqueName).name;
    this.taxConfirmationModel.show();
  }

  private updateTax(taxUniqueName) {
    this.isUpdateCondition = true;
    let taxes = _.cloneDeep(this.availableTaxes);
    let selectedTax = taxes.find((tax) => tax.uniqueName === taxUniqueName);
    if (selectedTax) {
      selectedTax.taxValue =  selectedTax.taxDetail[0].taxValue;
      // console.log('before converion: ', new Date(String(selectedTax.taxDetail[0].date)));
      // selectedTax.date =  selectedTax.taxDetail[0].date; // TODO: Assign date also
      this.newTaxObj = selectedTax;
    }
  }

  private onCancel() {
    this.newTaxObj = {};
    this.isUpdateCondition = false;
  }

  private deleteConfirmedTax(userResponse) { // userResponse is a boolean value
    this.taxConfirmationModel.hide();
    if (userResponse) {
      this.store.dispatch(this._settingsTaxesActions.DeleteTax(this.newTaxObj.uniqueName));
    }
  }
}
