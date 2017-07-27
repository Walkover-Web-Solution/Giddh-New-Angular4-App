import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AppState } from '../../../store/roots';
import { Scope, ISingleRole, Permission } from '../../../models/api-models/Permission';
import * as _ from 'lodash';

class NewRoleObj {
  constructor(
    public name: string,
    public scopes: Scope[],
    public isFixed?: boolean,
    public roleUniqueName?: string
  ) {  }
}

class NewPersmissionObj {
  constructor(
    public code: string,
    public isSelected: boolean
  ) {  }
}

@Component({
  selector: 'select-role-table',
  templateUrl: './table.html'
})

export class SelectRoleTableComponent implements OnInit {

  @Input() public role;
  @Output() public roleToSave: EventEmitter<object> = new EventEmitter<object>();
  private allRoles: any;
  private singlePageForFreshStart: any;
  // private selectedAll: boolean;
  private roleObj: any;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((role) => {
      this.allRoles = _.cloneDeep(role.roles);
      this.singlePageForFreshStart = _.find(this.allRoles, function(o: ISingleRole) {
        return o.uniqueName === 'super_admin_off_the_record';
      });
    });
  }

  public ngOnInit() {
    this.roleObj = new NewRoleObj(this.role.name, this.setScopeForCurrentRole(), this.checkForIsFixed(), this.checkForRoleUniqueName());
  }

  private setScopeForCurrentRole(): Scope[] {
    if (!this.checkForIsFixed()) {
      // copy role scenerio
      return this.generateUIFromExistedRole();
    }else {
      // fresh role logic here
      return this.generateFreshUI();
    }
  }

  private generateUIFromExistedRole() {
    let res = _.find(this.allRoles, function(o: ISingleRole) {
      return o.uniqueName === 'super_admin_off_the_record';
    });
    if (res) {
      _.forEach(res.scopes, (obj: Scope) => {
        _.map(obj.permissions, (o: Permission) => o.isSelected = false);
      });
      return res.scopes;
    }
  }

  private generateFreshUI() {
    let arr = [];
    let allRoles = _.cloneDeep(this.singlePageForFreshStart.scopes);
    _.forEach(this.role.selectedPages, (role: string) => {
      let res = _.find(allRoles, (o: Scope) => o.name === role);
      if (res) {
        // new NewPersmissionObj(o.code, false)
        _.map(res.permissions, (o: Permission) => o.isSelected = false);
        arr.push(res);
      }
    });
    return arr;
  }

  private checkForIsFixed(): boolean {
    return !this.role.isFresh;
  }

  private checkForRoleUniqueName(): string {
    if (this.role.isFresh) {
      return null;
    }else {
      return this.role.copiedRole;
    }
  }

}
