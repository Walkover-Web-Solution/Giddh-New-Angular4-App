import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { PermissionActions } from '../../../services/actions/permission/permission.action';
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
  templateUrl: './permission.details.html'
})

export class PermissionDetailsComponent {
  private newRole: any = {};
  private roleToSave: any = {};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private transactionMode: string;
  private allRoles: any;
  private singlePageForFreshStart: any;
  private rawDataForAllRoles: Permission[];
  private allRolesOfPage: Permission[];
  private roleObj: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private _location: Location,
    private permissionActions: PermissionActions
  ) 
  {

    this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((permission) => {
      let roleId = this.activatedRoute.snapshot.params.id;
      if (roleId) {
        this.transactionMode = 'update';
        this.newRole = permission.roles.find((role) => role.uniqueName === roleId);
      } else {
        this.transactionMode = 'create';
        this.newRole = permission.newRole;
      }
      this.roleToSave = this.newRole;
    });
    this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((role) => {
      this.allRoles = _.cloneDeep(role.roles);
      this.singlePageForFreshStart = _.find(this.allRoles, function(o: ISingleRole) {
        return o.uniqueName === 'super_admin_off_the_record';
      });
      this.rawDataForAllRoles = _.cloneDeep(this.singlePageForFreshStart.scopes[0].permissions)
      this.allRolesOfPage = this.getAllRolesOfPageReady(_.cloneDeep(this.rawDataForAllRoles));
    });
  }

  public goToRoles() {
    this._location.back();
  }


  public onPermissionSelection(data) {
    this.roleToSave = data;
  }

  public addNewRole(): any {
    console.log ('addNewRole', this);
    // if (this.transactionMode === 'create') {
    //   this.store.dispatch(this.permissionActions.SaveNewRole(this.roleToSave));
    // }else if (this.transactionMode === 'update') {
    //   this.store.dispatch(this.permissionActions.UpdateRole(this.roleToSave));
    // }
    // this.router.navigate(['/pages', 'permissions', 'list']);
  }


  public ngOnInit() {
    this.roleObj = new NewRoleObj(this.newRole.name, this.setScopeForCurrentRole(), this.checkForIsFixed(), this.checkForRoleUniqueName());
  }

  private getAllRolesOfPageReady(arr) {
    return _.forEach(arr, (o: Permission) => o.isSelected = false);
  }

  private setScopeForCurrentRole(): Scope[] {
    if (this.checkForIsFixed()) {
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
        let count = 0;
        _.forEach(obj.permissions, (o: Permission) => {
          if (o.isSelected){
            count += 1;
          }
        });
        if (count === obj.permissions.length){
          obj.selectAll = true;
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
    _.forEach(this.newRole.selectedPages, (role: string) => {
      let res = _.find(allRoles, (o: Scope) => o.name === role);
      if (res) {
        res.permissions = _.map(res.permissions, (o: Permission) => new NewPermissionObj(o.code, false));
        arr.push(res);
      }
    });
    return arr;
  }

  private checkForIsFixed(): boolean {
    return !this.newRole.isFresh;
  }

  private checkForRoleUniqueName(): string {
    if (this.newRole.isFresh) {
      return null;
    }else {
      return this.newRole.copiedRole;
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
        break;
      case 'VWDLT':
        result = 'view delete';
        break;
      default:
        result = '';
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
      let idx = _.findIndex(res.permissions, (o: Permission) => o.isSelected === false);
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
