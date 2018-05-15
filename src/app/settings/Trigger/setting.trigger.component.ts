import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { CompanyActions } from '../../actions/company.actions';
import { TaxResponse } from '../../models/api-models/Company';
import { AccountService } from '../../services/account.service';
import { ModalDirective } from 'ngx-bootstrap';
import { IOption } from '../../theme/ng-select/ng-select';
import { ToasterService } from '../../services/toaster.service';
import { IForceClear } from '../../models/api-models/Sales';
import { SettingsTriggersActions } from '../../actions/settings/triggers/settings.triggers.actions';

const entityType = [
  {label: 'Company', value: 'company'},
  {label: 'Group', value: 'group'},
  {label: 'Account', value: 'account'}
];

const actionType = [
  {label: 'Webhook', value: 'webhook'}
];

const filterType = [
  {label: 'Amount Greater Than', value: 'amountGreaterThan'},
  {label: 'Amount Less Than', value: 'amountLessThan'},
  {label: 'Amount Equals', value: 'amountEquals'},
  {label: 'Description Equals', value: 'descriptionEquals'},
  {label: 'Add', value: 'add'},
  {label: 'Update', value: 'update'},
  {label: 'Delete', value: 'delete'}
];

const scopeList = [
  {label: 'Invoice', value: 'invoice'},
  {label: 'Entry', value: 'entry'}
];

const taxDuration = [
  {label: 'Monthly', value: 'MONTHLY'},
  {label: 'Quarterly', value: 'QUARTERLY'},
  {label: 'Half-Yearly', value: 'HALFYEARLY'},
  {label: 'Yearly', value: 'YEARLY'}
];

@Component({
  selector: 'setting-trigger',
  templateUrl: './setting.trigger.component.html'
})
export class SettingTriggerComponent implements OnInit {

  @ViewChild('triggerConfirmationModel') public triggerConfirmationModel: ModalDirective;

  public availableTriggers: any[] = [];
  public newTriggerObj: any = {};
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
  public accounts: IOption[];
  public groups: IOption[];
  public triggerToEdit = []; // It is for edit toogle
  public companies: IOption[];
  public entityList: IOption[] = entityType;
  public filterList: IOption[] = filterType;
  public actionList: IOption[] = actionType;
  public scopeList: IOption[] = scopeList;
  public forceClear$: Observable<IForceClear> = Observable.of({status: false});
  public forceClearEntityList$: Observable<IForceClear> = Observable.of({status: false});
  public entityOptions$: Observable<IOption[]>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private _companyActions: CompanyActions,
    private _accountService: AccountService,
    private _settingsTriggersActions: SettingsTriggersActions,
    private _toaster: ToasterService
  ) {
    for (let i = 1; i <= 31; i++) {
      let day = i.toString();
      this.days.push({label: day, value: day});
    }

    this.store.dispatch(this._settingsTriggersActions.GetTriggers());
  }

  public ngOnInit() {
    this.store.select(p => p.settings.triggers).takeUntil(this.destroyed$).subscribe((o) => {
      if (o) {
        this.forceClear$ = Observable.of({status: true});
        this.availableTriggers = _.cloneDeep(o);
      }
    });

    this.getFlattenAccounts('');

    this.store.select((state: AppState) => state.general.addAndManageClosed).subscribe((bool) => {
      if (bool) {
        this.getFlattenAccounts('');
      }
    });

    this.store.select(p => p.general.groupswithaccounts).takeUntil(this.destroyed$).subscribe((groups) => {
      if (groups) {
        let groupsRes: IOption[] = [];
        groups.map(d => {
          groupsRes.push({label: `${d.name} - (${d.uniqueName})`, value: d.uniqueName});
        });
        this.groups = _.cloneDeep(groupsRes);
      }
    });

    this.store.select(p => p.session.companies).takeUntil(this.destroyed$).subscribe((companies) => {
      if (companies) {
        let companiesRes: IOption[] = [];
        companies.map(d => {
          companiesRes.push({label: `${d.name} - (${d.uniqueName})`, value: d.uniqueName});
        });
        this.companies = _.cloneDeep(companiesRes);
      }
    });
  }

  public onSubmit(data) {
    let dataToSave = _.cloneDeep(data);
    if (!dataToSave.name) {
      this._toaster.errorToast('Please enter trigger name.', 'Validation');
      return;
    }
    if (!dataToSave.entity) {
      this._toaster.errorToast('Please select entity type.', 'Validation');
      return;
    }
    if (!dataToSave.entityUniqueName) {
      this._toaster.errorToast('Please select an entity.', 'Validation');
      return;
    }
    if (!dataToSave.scope) {
      this._toaster.errorToast('Please select a scope.', 'Validation');
      return;
    }
    if (!dataToSave.filter) {
      this._toaster.errorToast('Please select a filter.', 'Validation');
      return;
    }
    if (!dataToSave.action) {
      this._toaster.errorToast('Please select an action.', 'Validation');
      return;
    }
    if (!dataToSave.value) {
      this._toaster.errorToast('Please enter value.', 'Validation');
      return;
    }
    if (!dataToSave.url) {
      this._toaster.errorToast('Please enter URL.', 'Validation');
      return;
    }
    this.store.dispatch(this._settingsTriggersActions.CreateTrigger(dataToSave));
  }

  public deleteTax(taxToDelete) {
    this.newTriggerObj = taxToDelete;
    this.selectedTax = this.availableTriggers.find((tax) => tax.uniqueName === taxToDelete.uniqueName).name;
    this.confirmationMessage = `Are you sure want to delete ${this.selectedTax}?`;
    this.confirmationFor = 'delete';
    this.triggerConfirmationModel.show();
  }

  public updateTrigger(taxIndex: number) {
    let selectedTrigger = _.cloneDeep(this.availableTriggers[taxIndex]);
    this.newTriggerObj = selectedTrigger;
    this.confirmationMessage = `Are you sure want to update ${selectedTrigger.name}?`;
    this.confirmationFor = 'edit';
    this.triggerConfirmationModel.show();
  }

  public onCancel() {
    this.newTriggerObj = new TaxResponse();
  }

  public userConfirmation(userResponse: boolean) {
    this.triggerConfirmationModel.hide();
    if (userResponse) {
      if (this.confirmationFor === 'delete') {
        this.store.dispatch(this._settingsTriggersActions.DeleteTrigger(this.newTriggerObj.uniqueName));
      } else if (this.confirmationFor === 'edit') {
        _.each(this.newTriggerObj.taxDetail, (tax) => {
          tax.date = moment(tax.date).format(GIDDH_DATE_FORMAT);
        });
        this.store.dispatch(this._settingsTriggersActions.UpdateTrigger(this.newTriggerObj));
      }
    }
  }

  public addMoreDateAndPercentage(taxIndex: number) {
    let taxes = _.cloneDeep(this.availableTriggers);
    taxes[taxIndex].taxDetail.push({date: null, taxValue: null});
    this.availableTriggers = taxes;
  }

  public removeDateAndPercentage(parentIndex: number, childIndex: number) {
    let taxes = _.cloneDeep(this.availableTriggers);
    taxes[parentIndex].taxDetail.splice(childIndex, 1);
    this.availableTriggers = taxes;
  }

  /**
   *
   */
  public getFlattenAccounts(value) {
    let query = value || '';
    // get flattern accounts
    this._accountService.GetFlattenAccounts(query, '').debounceTime(100).takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: IOption[] = [];
        data.body.results.map(d => {
          accounts.push({label: `${d.name} - (${d.uniqueName})`, value: d.uniqueName});
        });
        this.accounts = accounts;
      }
    });
  }

  public customAccountFilter(term: string, item: IOption) {
    return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
  }

  public customDateSorting(a: IOption, b: IOption) {
    return (parseInt(a.label) - parseInt(b.label));
  }

  public onEntityTypeSelected(ev) {
    this.forceClearEntityList$ = Observable.of({status: true});
    if (ev.value === 'account') {
      this.entityOptions$ = Observable.of(this.accounts);
    } else if (ev.value === 'group') {
      this.entityOptions$ = Observable.of(this.groups);
    } else if (ev.value === 'company') {
      this.entityOptions$ = Observable.of(this.companies);
    }
  }

  public onResetEntityType() {
    this.newTriggerObj.entityType = '';
    this.forceClearEntityList$ = Observable.of({status: true});
  }

}
