import { CompanyActions } from './../../../services/actions/company.actions';
import { AppState } from './../../../store/roots';
import { Store } from '@ngrx/store';
import { IOption } from './../../../theme/ng-select/option.interface';
import { AccountService } from './../../../services/account.service';
import { AccountResponseV2 } from './../../../models/api-models/Account';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
@Component({
  selector: 'advance-search-model',
  templateUrl: './advance-search.component.html'
})

export class AdvanceSearchModelComponent implements OnInit {

  @Input() public selectedRoleForDelete: IRoleCommonResponseAndRequest;
  @Output() public confirmDeleteEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public activeAccount$: Observable<AccountResponseV2>;
  public accounts$: Observable<IOption[]>;
  public selectedaccountForMerge: any = [];
  public checkModel: string = 'all';
  public showOtherDetails: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
    //
  }

  public onConfirmation() {
    this.confirmDeleteEvent.emit(true);
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }
}
