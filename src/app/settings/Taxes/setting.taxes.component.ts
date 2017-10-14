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
import * as moment from 'moment/moment';
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
  public newTaxObj: TaxResponse = new TaxResponse();
  public moment = moment;
  public days: number[] = [];
  public records = []; // This array is just for generating dynamic ngModel
  public taxToEdit = []; // It is for edit toogle
  public showFromDatePicker: boolean = false;
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
    // console.log('hello from SettingTaxesComponent');

    // get flatternaccounts
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: Select2OptionData[] = [];
        data.body.results.map(d => {
          accounts.push({ text: `${d.name} (${d.uniqueName})`, id: d.uniqueName });
        });
        this.accounts$ = accounts;
      }
    });

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
        if (obj.id === dataToSave.account) {
          dataToSave.accounts.push({ name: obj.text, uniqueName: obj.id });
        }
      });
    }

    dataToSave.date = moment(dataToSave.date).format('DD-MM-YYYY');
    dataToSave.accounts = dataToSave.accounts ? dataToSave.accounts : [];
    dataToSave.taxDetail = [{ date: dataToSave.date, taxValue: dataToSave.taxValue }];

    this.store.dispatch(this._settingsTaxesActions.CreateTax(dataToSave));
  }

  public deleteTax(taxUniqueName) {
    this.newTaxObj.uniqueName = taxUniqueName;
    this.selectedTaxForDelete = this.availableTaxes.find((tax) => tax.uniqueName === taxUniqueName).name;
    this.taxConfirmationModel.show();
  }

  public updateTax(taxIndex: number) {
    let taxToUpdate = _.cloneDeep(this.availableTaxes[taxIndex]);
    this.store.dispatch(this._settingsTaxesActions.UpdateTax(taxToUpdate));
  }

  public onCancel() {
    this.newTaxObj = new TaxResponse();
  }

  public deleteConfirmedTax(userResponse: boolean) {
    this.taxConfirmationModel.hide();
    if (userResponse) {
      this.store.dispatch(this._settingsTaxesActions.DeleteTax(this.newTaxObj.uniqueName));
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
}
