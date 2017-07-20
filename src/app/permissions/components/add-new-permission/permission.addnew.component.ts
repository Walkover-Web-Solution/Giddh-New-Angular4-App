import { Component, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { PermissionActions } from '../../../services/actions/permission/permission.action';

export interface InewRole {
  name: string;
  copyoption: string;
  pages: any[];
  scopes: any[];
}

@Component({
  selector: 'permission-addnew',
  templateUrl: './permission.addnew.component.html'
})

export class AddNewPermissionComponent {

  public allRoles: any;
  private newRole: any = {};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private names: any;
  private selectedAll: any;
  private newScope = [];

  // TODO: This should be created dynamically
  private checkBoxes = {
    RECURRING_ENTRY: false,
    INVENTORY: false,
    DASHBOARD: false,
    SEARCH: false,
    INVOICE: false,
    AUDIT_LOGS: false,
    REPORT: false,
    LEDGER: false,
    MANAGE: false,
    SETTINGS: false
  };

  constructor(private router: Router,
    private store: Store<AppState>,
    private _location: Location,
    private permissionActions: PermissionActions
  ) {
    this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((role) => {
      this.newRole = role.newRole;
      this.allRoles = role.roles;
      console.log('++++++++ Hello the newRole information is :', this.newRole);
      console.log('++++++++ Hello the allRoles information is :', this.allRoles);
      // this.names = [
      //   { name: 'Prashobh', selected: false },
      //   { name: 'Abraham', selected: false },
      //   { name: 'Anil', selected: false },
      //   { name: 'Sam', selected: false },
      //   { name: 'Natasha', selected: false },
      //   { name: 'Marry', selected: false },
      //   { name: 'Zian', selected: false },
      //   { name: 'karan', selected: false },
      // ]
    });
  }

  public goToRoles() {
    this._location.back();
  }

  // public selectAll() {
  //   for (var i = 0; i < this.names.length; i++) {
  //     this.names[i].selected = this.selectedAll;
  //   }
  // }
  public checkIfAllSelected() {
    this.selectedAll = this.names.every(function (item: any) {
      return item.selected === true;
    });
  }

  /**
   * getPermissionCode
   */
  public getPermissionCode(permission) {
    let code;
    switch (permission) {
      case 'view':
        code = 'VW';
        break;
      case 'edit':
        code = 'UPDT';
        break;
      case 'delete':
        code = 'DLT';
        break;
      case 'create':
        code = 'ADD';
        break;
      case 'share':
        code = 'SHR';
        break;
    }
    return code;
  }

  /**
   * `checkPermission`: Returns true or false
   * @param page: Head name
   * @param permission: View or Edit
   * @param role: View only or admin
   */
  public checkPermission(page, permission, roleName) {

    let permissionCode = this.getPermissionCode(permission);

    let indx = this.allRoles.findIndex(function (role) {
      return role.uniqueName == roleName;
    });

    if (indx > -1) {
      let existance = this.allRoles[indx].scopes.findIndex(function (item) {
        return item.name == page;
      });

      if (existance > -1) {
        let exist = this.allRoles[indx].scopes[existance].permissions.findIndex(function (item) {
          return item.code == permissionCode;
        });

        if (exist > -1) {
          return true;
        }
      }
    }
    return false;
  }

  public selectPageAndPermission(pageName, permission, event) {
    let isChecked = event.target.checked;
    console.log('Is checked is :', isChecked);
    let permissionCode = this.getPermissionCode(permission);
    let indx = this.newScope.findIndex((item) => item.name === pageName);

    if (isChecked) {
      if (indx !== -1) {
        this.newScope[indx].permissions.push({ code: permissionCode });
      } else {
        this.newScope.push({ name: pageName, permissions: [{ code: permissionCode }] });
      }
    } else {

      if (this.checkBoxes[pageName]) {
        event.target.checked = false;
        this.checkBoxes[pageName] = true;
      }

      if (indx !== -1) {
        let permissionIndex = this.newScope[indx].permissions.findIndex((item) => item.code === permissionCode);
        if (permissionIndex !== -1) {
          this.newScope[indx].permissions.splice(permissionIndex, 1);
          if (this.newScope[indx].permissions.length === 0) {
            this.newScope.splice(indx, 1);
          }
        }
      }
    }
    console.log('Inside selectPageAndPermission the this.newScope is :', this.newScope);
  }

  public addNewRole(): any {
    // this.newRole.scopes = this.newScope;
    this.store.dispatch(this.permissionActions.SaveNewRole(this.newRole));
    this.router.navigate(['/pages', 'permissions']);
  }

  public selectAll(pageName, event) {
    let isChecked = event.target.checked;
    let allPermissions = [
      { code: 'VW' },
      { code: 'UPDT' },
      { code: 'DLT' },
      { code: 'ADD' },
      { code: 'SHR' }
    ];
    let indx = this.newScope.findIndex((item) => item.name === pageName);
    if (isChecked) {

      this.checkBoxes[pageName] = true;

      if (indx !== -1) {
        this.newScope[indx].permissions = allPermissions;
      } else {
        this.newScope.push({ name: pageName, permissions: allPermissions });
      }
    } else {
      this.checkBoxes[pageName] = false;
      if (indx !== -1) {
        this.newScope.splice(indx, 1);
      }
    }

    console.log('Inside selectAll the this.newScope is :', this.newScope);

  }

}
