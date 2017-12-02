import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { AfterViewInit, Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CompanyResponse, StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';

@Component({
  selector: 'tb-pl-bs',
  templateUrl: './tb-pl-bs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbPlBsComponent implements OnInit, AfterViewInit {

  public selectedCompany: CompanyResponse;
  public CanTBLoad: boolean = true;
  public CanPLLoad: boolean = false;
  public CanBSLoad: boolean = false;

  constructor(private store: Store<AppState>, private companyActions: CompanyActions, private cd: ChangeDetectorRef) {
    this.store.select(p => p.session.companies && p.session.companies.find(q => q.uniqueName === p.session.companyUniqueName)).subscribe(p => {
      this.selectedCompany = p;
    });
  }

  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'trial-balance-and-profit-loss';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }

  public ngAfterViewInit() {
    //
  }
  // public SHOWBS() {
  //   this.CanBSLoad = true;
  //   this.cd.detectChanges();
  //   debugger;
  // }
}
