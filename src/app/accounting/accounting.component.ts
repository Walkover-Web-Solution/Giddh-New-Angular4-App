import { TallyModuleService } from './tally-service';
import { KeyboardService } from 'app/accounting/keyboard.service';
import { Router } from '@angular/router';
import { Component, OnInit, HostListener } from '@angular/core';
import { CompanyActions } from '../actions/company.actions';
import { AppState } from '../store/roots';
import { Store } from '@ngrx/store';
import { StateDetailsRequest } from '../models/api-models/Company';

@Component({
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})

export class AccountingComponent implements OnInit {

  public gridType: string = 'voucher';
  public selectedPage: string = 'voucher';

  constructor(private store: Store<AppState>,
    private companyActions: CompanyActions,
    private _router: Router,
    private _keyboardService: KeyboardService,
    private _tallyModuleService: TallyModuleService) {
      this._tallyModuleService.selectedPageInfo.subscribe((d) => {
        this.gridType = d.gridType;
        this.selectedPage = d.page;
      });
  }

  @HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    this._keyboardService.setKey(event);
    // console.log(event);
  }
  public ngOnInit(): void {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'accounting';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }

}
