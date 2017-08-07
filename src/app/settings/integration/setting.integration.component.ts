import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '../../store/roots';
import { SettingsIntegrationActions } from '../../services/actions/settings/settings.integration.action';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash';
import { SmsKeyClass } from '../../models/api-models/SettingsIntegraion';

@Component({
  selector: 'setting-integration',
  templateUrl: './setting.integration.component.html'
})
export class SettingIntegrationComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private smsFormObj = {};
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private SettingsIntegrationActions: SettingsIntegrationActions
  ) {}

  public ngOnInit() {
    this.store.dispatch(this.SettingsIntegrationActions.GetSMSKey());
    this.store.select(p => p.settings.integration).takeUntil(this.destroyed$).subscribe((o) => {
      // getting all page data of integration page
      this.smsFormObj = o.smsForm;
      console.log('SettingIntegrationComponent', this.smsFormObj);
    });
  }

  private onSubmitMsgform(f: NgForm) {
    console.log(f.value);
    console.log(f.valid);
  }
  private onCancelMsgform() {
    console.log('onCancelMsgform');
  }
}
