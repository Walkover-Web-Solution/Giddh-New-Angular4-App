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
import { SettingsLinkedAccountsService } from '../../services/settings.linked.accounts.service';
import { SettingsLinkedAccountsActions } from '../../services/actions/settings/linked-accounts/settings.linked.accounts.action';
import { IGetAllEbankAccountResponse } from '../../models/api-models/SettingsLinkedAccounts';

@Component({
  selector: 'setting-linked-accounts',
  templateUrl: './setting.linked.accounts.component.html'
})
export class SettingLinkedAccountsComponent implements OnInit {

  @ViewChild('taxConfirmationModel') public taxConfirmationModel: ModalDirective;

  public iframeSource: string;
  public ebankAccounts: IGetAllEbankAccountResponse[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private _settingsLinkedAccountsService: SettingsLinkedAccountsService,
    private settingsLinkedAccountsActions: SettingsLinkedAccountsActions
  ) {}

  public ngOnInit() {

    this.store.select(p => p.settings).takeUntil(this.destroyed$).subscribe((o) => {
      if (o.linkedAccounts && o.linkedAccounts.length) {
        this.ebankAccounts = _.cloneDeep(o.linkedAccounts);
      } else {
        this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
      }
    });

    // get token info
    this._settingsLinkedAccountsService.GetEbankToken().takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        this.iframeSource = data.body.connectUrl;
      }
    });
  }

  public connectBank() {
    this.taxConfirmationModel.show();
  }

  public closeModal() {
    this.taxConfirmationModel.hide();
  }
}
