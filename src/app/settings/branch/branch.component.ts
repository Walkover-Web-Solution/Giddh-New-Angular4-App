import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';
import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { ToasterService } from '../../services/toaster.service';
import { ShSelectComponent } from 'app/theme/ng-virtual-select/sh-select.component';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { ModalDirective, BsDropdownConfig } from 'ngx-bootstrap';

export const IsyncData = [
  { label: 'Debtors', value: 'debtors' },
  { label: 'Creditors', value: 'creditors' },
  { label: 'Inventory', value: 'inventory' },
  { label: 'Taxes', value: 'taxes' },
  { label: 'Bank', value: 'bank' }
];

@Component({
  selector: 'setting-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})

export class BranchComponent implements OnInit {
  @ViewChild('branchModal') public branchModal: ModalDirective;

  public dataSyncOption = IsyncData;
  public currentBranch: string = null;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private settingsProfileActions: SettingsProfileActions
  ) {

    this.store.select(p => p.settings.profile).takeUntil(this.destroyed$).subscribe((o) => {
      if (o && !_.isEmpty(o)) {
        let companyInfo = _.cloneDeep(o);
        this.currentBranch = companyInfo.name;
      } else {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
      }
    });
    console.log('branch component');
  }

  public ngOnInit() {
    console.log('branch component');
  }

  public openAddBranchModal() {
    this.branchModal.show();
  }
}
