import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { PermissionActions } from '../../../services/actions/permission/permission.action';
import { Scope, IRoleCommonResponseAndRequest, Permission } from '../../../models/api-models/Permission';
import * as _ from 'lodash';
import { NewRoleClass, NewPermissionObj, IPage, IPageStr } from '../../permission.utility';

@Component({
  templateUrl: './permission.details.html'
})

export class PermissionDetailsComponent implements OnInit {
  private pageList: IPageStr[];
  private newRole: any = {};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private allRoles: any;
  private singlePageForFreshStart: any;
  private rawDataForAllRoles: Permission[];
  private allRolesOfPage: Permission[];
  private roleObj: NewRoleClass;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private _location: Location,
    private permissionActions: PermissionActions
  ) {

    this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((permission) => {
      this.allRoles = _.cloneDeep(permission.roles);
      this.singlePageForFreshStart = _.find(this.allRoles, function(o: IRoleCommonResponseAndRequest) {
        return o.uniqueName === 'super_admin_off_the_record';
      });
      this.rawDataForAllRoles = _.cloneDeep(this.singlePageForFreshStart.scopes[0].permissions);
      this.allRolesOfPage = this.getAllRolesOfPageReady(_.cloneDeep(this.rawDataForAllRoles));
      this.newRole = permission.newRole;
      this.pageList = permission.pages;
    });
  }

  public ngOnInit() {
    if (_.isEmpty(this.newRole)) {
      this.router.navigate(['/pages', 'permissions', 'list']);
    }else if (this.newRole.isUpdateCase) {
      this.roleObj = new NewRoleClass(this.newRole.name, this.setScopeForCurrentRole(), false, this.newRole.uniqueName, this.newRole.isUpdateCase);
    } else {
      this.roleObj = new NewRoleClass(this.newRole.name, this.setScopeForCurrentRole(), this.newRole.isFresh, this.checkForRoleUniqueName());
    }
  }

  private addNewPage(page: string) {
    if (!this.checkForAlreadyExistInPageArray(page)) {
      let pageObj = _.find(this.singlePageForFreshStart.scopes, (o: Scope) => o.name === page);
      pageObj.permissions = pageObj.permissions.map((o: Permission) => {
        return o = new NewPermissionObj(o.code, false);
      });
      this.roleObj.scopes.push(pageObj);
    }
  }

  private removePageFromScope(page: string) {
    this.roleObj.scopes.splice(this.roleObj.scopes.findIndex((o: Scope) => o.name === page), 1);
  }

  private checkForAlreadyExistInPageArray(page: string): boolean {
    let idx = _.findIndex(this.roleObj.scopes, (o: Scope) => {
      return o.name === page;
    });
    if (idx !== -1) {
      return true;
    }else {
      return false;
    }
  }

  private goToRoles() {
    this._location.back();
  }

  private getScopeDataReadyForAPI(data): Scope[] {
    let arr: Scope[];
    arr = _.forEach(data.scopes, (page: Scope) => {
      _.remove(page.permissions, (o: Permission) => !o.isSelected );
    });
    return arr;
  }

  private addNewRole(): any {
    let data = _.cloneDeep(this.roleObj);
    data.scopes = this.getScopeDataReadyForAPI(data);
    this.store.dispatch(this.permissionActions.CreateRole(data));
  }

  private updateRole() {
    let data = _.cloneDeep(this.roleObj);
    data.scopes = this.getScopeDataReadyForAPI(data);
    console.log( 'updateRole', data );
    this.store.dispatch(this.permissionActions.UpdateRole(data));
  }

  private getAllRolesOfPageReady(arr) {
    return _.forEach(arr, (o: Permission) => o.isSelected = false);
  }

  private setScopeForCurrentRole(): Scope[] {
    if (this.newRole.isFresh) {
      // fresh role logic here
      return this.generateFreshUI();
    }else {
      // copy role scenerio
      return this.generateUIFromExistedRole();
    }
  }

  private generateUIFromExistedRole() {
    let pRole: string = this.newRole.uniqueName || 'super_admin_off_the_record';
    let res = _.find(this.allRoles, function(o: IRoleCommonResponseAndRequest) {
      return o.uniqueName === pRole;
    });
    if (res) {
      _.forEach(res.scopes, (obj: Scope) => {
        _.map(obj.permissions, (o: Permission) => o.isSelected = true);
        if (obj.permissions.length < 6) {
          obj.permissions = this.pushNonExistRoles(obj.permissions, this.getAllRolesOfPageReady(_.cloneDeep(this.rawDataForAllRoles)));
        }
        let count = 0;
        _.forEach(obj.permissions, (o: Permission) => {
          if (o.isSelected) {
            count += 1;
          }
        });
        if (count === obj.permissions.length) {
          obj.selectAll = true;
        }
      });
      return res.scopes;
    }
  }

  private pushNonExistRoles(arr1, arr2) {
    _.forEach(arr1, (o: Permission) => {
      arr2 = _.map(arr2, (item: Permission) => {
        if (o.code === item.code){
          return new NewPermissionObj(o.code, o.isSelected);
        }else {
          return new NewPermissionObj(item.code, false);
        }
      });
    });
    return arr2;
  }

  private generateFreshUI() {
    let arr = [];
    let allRoles = _.cloneDeep(this.singlePageForFreshStart.scopes);
    _.forEach(this.newRole.pageList, (item: IPage) => {
      if (item.isSelected) {
        let res = _.find(allRoles, (o: Scope) => o.name === item.name);
        if (res) {
          res.permissions = _.map(res.permissions, (o: Permission) => new NewPermissionObj(o.code, false));
          arr.push(res);
        }
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
      return this.newRole.uniqueName;
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
      _.map(res.permissions, (o: Permission) => o.isSelected = event.target.checked ? true : false );
    }
  }

  private toggleItem = function(pageName: string, item: Permission, event: any) {
    let res = _.find(this.roleObj.scopes, (o: Scope) => o.name === pageName);
    if (event.target.checked) {
      let idx = _.findIndex(res.permissions, (o: Permission) => o.isSelected === false);
      if (idx !== -1) {
        return res.selectAll = false;
      }else {
        return res.selectAll = true;
      }
    }else {
      return res.selectAll = false;
    }
  }

}
