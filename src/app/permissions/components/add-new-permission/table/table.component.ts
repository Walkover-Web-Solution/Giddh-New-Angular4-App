import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export class ChkboxDefination {
  public view: boolean = false;
  public edit: boolean = false;
  public delete: boolean = false;
  public create: boolean = false;
  public share: boolean = false;
  public checkAll: boolean = false;
}

@Component({
  selector: 'select-role-table',
  templateUrl: './table.component.html'
})

export class SelectRoleTableComponent {

  @Input() public role;
  public allRoles: any;
  private newScope = [];
  private selectedAll: boolean;
  // TODO: This should be created dynamically
  private checkBoxes = {
    RECURRING_ENTRY: ChkboxDefination,
    INVENTORY: ChkboxDefination,
    DASHBOARD: ChkboxDefination,
    SEARCH: ChkboxDefination,
    INVOICE: ChkboxDefination,
    AUDIT_LOGS: ChkboxDefination,
    REPORT: ChkboxDefination,
    LEDGER: ChkboxDefination,
    MANAGE: ChkboxDefination,
    SETTINGS: ChkboxDefination
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((role) => {
      this.allRoles = role.roles;
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
    let permissionCode = this.getPermissionCode(permission);
    let indx = this.newScope.findIndex((item) => item.name === pageName);

    if (isChecked) {
      if (indx !== -1) {
        this.newScope[indx].permissions.push({ code: permissionCode });
      } else {
        this.newScope.push({ name: pageName, permissions: [{ code: permissionCode }] });
      }
    } else {
      this.checkBoxes[pageName].checkAll = false; // All checkboxes are not checked
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

  public selectAll(pageName, event) {
    let isChecked = event.target.checked;
    this.checkBoxes[pageName].view = isChecked;
    this.checkBoxes[pageName].edit = isChecked;
    this.checkBoxes[pageName].create = isChecked;
    this.checkBoxes[pageName].delete = isChecked;
    this.checkBoxes[pageName].share = isChecked;
    this.checkBoxes[pageName].checkAll = isChecked;

    let allPermissions = [
      { code: 'VW' },
      { code: 'UPDT' },
      { code: 'DLT' },
      { code: 'ADD' },
      { code: 'SHR' }
    ];

    let indx = this.newScope.findIndex((item) => item.name === pageName);
    if (isChecked) {
      if (indx !== -1) {
        this.newScope[indx].permissions = allPermissions;
      } else {
        this.newScope.push({ name: pageName, permissions: allPermissions });
      }
    } else {
      if (indx !== -1) {
        this.newScope.splice(indx, 1);
      }
    }
    console.log('Inside sselectAll the this.newScope is :', this.newScope);
  }
}