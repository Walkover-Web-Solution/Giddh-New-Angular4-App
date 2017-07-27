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

class NewPermissionObj {
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
  private rawDataForAllRoles: Permission[];
  private allRolesOfPage: Permission[];
  private roleObj: any;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((role) => {
      this.allRoles = _.cloneDeep(role.roles);
      this.singlePageForFreshStart = _.find(this.allRoles, function(o: ISingleRole) {
        return o.uniqueName === 'super_admin_off_the_record';
      });
      this.rawDataForAllRoles = _.cloneDeep(this.singlePageForFreshStart.scopes[0].permissions)
      this.allRolesOfPage = this.getAllRolesOfPageReady(_.cloneDeep(this.rawDataForAllRoles));
    });
  }

  public ngOnInit() {
    this.roleObj = new NewRoleObj(this.role.name, this.setScopeForCurrentRole(), this.checkForIsFixed(), this.checkForRoleUniqueName());
  }

  private getAllRolesOfPageReady(arr) {
    return _.forEach(arr, (o: Permission) => o.isSelected = false);
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
        _.map(obj.permissions, (o: Permission) => o.isSelected = true);
        if(obj.permissions.length < 6){
          obj.permissions = this.pushNonExistRoles(obj.permissions, this.getAllRolesOfPageReady(_.cloneDeep(this.rawDataForAllRoles)));
        }
      });
      return res.scopes;
    }
  }

  private pushNonExistRoles(arr1, arr2){
    _.forEach(arr1, (o: Permission) => {
      arr2 = _.map(arr2, (item: Permission) => {
        if (o.code === item.code){
          return new NewPermissionObj(o.code, o.isSelected);
        }
        else{
          return new NewPermissionObj(item.code, false);
        }
      });
    });
    return arr2;
  }

  private generateFreshUI() {
    let arr = [];
    let allRoles = _.cloneDeep(this.singlePageForFreshStart.scopes);
    _.forEach(this.role.selectedPages, (role: string) => {
      let res = _.find(allRoles, (o: Scope) => o.name === role);
      if (res) {
        _.map(res.permissions, (o: Permission) => new NewPermissionObj(o.code, false));
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

  private getNameByCode(code: string) {
    let result: string;
    switch (code) {
      case 'VW':
        result = 'view';
        break;
      case 'UPDT':
        result = 'edit';
        break;
      case 'DLT':
        result = 'delete';
        break;
      case 'ADD':
        result = 'create';
        break;
      case 'SHR':
        result = 'share';
      case 'VWDLT':
        result = 'view delete';
        break;
      default:
        result = '';
        break;
    }
    return result;
  }

  private toggleItems = function(pageName: string, event: any) {
    let res = _.find(this.roleObj.scopes, (o: Scope) => o.name === pageName);
    if (res) {
      _.map(res.permissions, (o: Permission) => o.isSelected = event.target.checked? true : false );
    }
  }

  private toggleItem = function(pageName: string, item: Permission, event: any) {
    let res = _.find(this.roleObj.scopes, (o: Scope) => o.name === pageName);
    if (event.target.checked){
      let idx = _.findIndex(res.permissions, (o: Permission) => new NewPermissionObj(o.code, false));
      if (idx !== -1){
        return res.selectAll = false;
      }
      else{
        return res.selectAll = true;
      }
    }
    else{
      return res.selectAll = false;
    }
  }

}
