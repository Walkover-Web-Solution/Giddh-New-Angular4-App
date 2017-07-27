import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AppState } from '../../../store/roots';
import { Scope } from '../../../models/api-models/Permission';

export class ChkboxDefination {
  public view: boolean = false;
  public edit: boolean = false;
  public delete: boolean = false;
  public create: boolean = false;
  public share: boolean = false;
  public checkAll: boolean = false;
}

export interface Role {
  name: string;
  scopes: Scope[];
  roleUniqueName: string;
}

@Component({
  selector: 'select-role-table',
  templateUrl: './table.html'
})

export class SelectRoleTableComponent implements OnInit, AfterViewChecked {

  @Input() public role;
  @Output() public roleToSave: EventEmitter<object> = new EventEmitter<object>();
  public allRoles: any;
  private newScope = [];
  private selectedAll: boolean;
  private finalRole: Role = {
    name: '',
    scopes: [],
    roleUniqueName: ''
  };
  // TODO: This should be created dynamically
  private checkBoxes = {
    RECURRING_ENTRY: { view: false, edit: false, delete: false, create: false, share: false, checkAll: false },
    INVENTORY: { view: false, edit: false, delete: false, create: false, share: false, checkAll: false },
    DASHBOARD: { view: false, edit: false, delete: false, create: false, share: false, checkAll: false },
    SEARCH: { view: false, edit: false, delete: false, create: false, share: false, checkAll: false },
    INVOICE: { view: false, edit: false, delete: false, create: false, share: false, checkAll: false },
    AUDIT_LOGS: { view: false, edit: false, delete: false, create: false, share: false, checkAll: false },
    REPORT: { view: false, edit: false, delete: false, create: false, share: false, checkAll: false },
    LEDGER: { view: false, edit: false, delete: false, create: false, share: false, checkAll: false },
    MANAGE: { view: false, edit: false, delete: false, create: false, share: false, checkAll: false },
    SETTINGS: { view: false, edit: false, delete: false, create: false, share: false, checkAll: false },
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((role) => {
      this.allRoles = role.roles;
    });
  }

  public ngOnInit() {
    this.finalRole.name = this.role.name;
    this.finalRole.roleUniqueName = this.role.uniqueName;
    this.finalRole.scopes = this.role.scopes ? this.role.scopes : [];
    console.log('The final role is *******:', this.finalRole);


  }

  public ngAfterViewChecked() {
    // this.checkPermissionInCurrentRole();
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

  public checkPermissionInCurrentRole(permissionArray, permission) {

    let indx = permissionArray.findIndex((page) => page.code === this.getPermissionCode(permission));
    if (indx > -1) {
      this.checkBoxes.SEARCH.create = true;
      console.log('returning true');
      return true;
    } else {
      console.log('returning false');
      return false;
    }
    // if (this.finalRole.scopes.length) {
    //   let pageObj = this.finalRole.scopes.find((p) => p.name === page);
    //   if (pageObj && pageObj.permissions) {
    //     let indx = pageObj.permissions.findIndex((item) => item.code == this.getPermissionCode(permission));
    //     if (indx > -1) {
    //       this.checkBoxes[page][permission] = true;
    //       return true;
    //     }
    //   }
    // }
    // return false;
  }

    // this.finalRole.scopes.forEach((page) => {
    //   let permissionCode = this.getPermissionCode(permission);
    //   this.finalRole.scopes.find((item) => item.name);
    //   let existance = this.role.scopes.findIndex((item) => item.name === page);
    //   if (existance > -1) {
    //     let exist = this.role.scopes[existance].permissions.findIndex((item) => item.code === permissionCode);
    //     if (exist > -1) {
    //       this.checkBoxes[page][permission] = true;
    //       if (this.checkBoxes[page].create && this.checkBoxes[page].edit && this.checkBoxes[page].delete && this.checkBoxes[page].share && this.checkBoxes[page].view) {
    //         this.checkBoxes[page].checkAll = true;
    //       } else {
    //         this.checkBoxes[page].checkAll = false;
    //       }
    //     }
    //   }
    // });

  public selectPageAndPermission(pageName, permission, event) {
    let isChecked = event.target.checked;
    let permissionCode = this.getPermissionCode(permission);
    let indx = this.finalRole.scopes.findIndex((page) => page.name === pageName);

    if (isChecked) {
      if (indx !== -1) {
        this.finalRole.scopes[indx].permissions.push({ code: permissionCode });
      } else {
        this.finalRole.scopes.push({ name: pageName, permissions: [{ code: permissionCode }] });
      }
    } else {
      this.checkBoxes[pageName].checkAll = false; // All checkboxes are not checked
      if (indx !== -1) {
        let permissionIndex = this.finalRole.scopes[indx].permissions.findIndex((item) => item.code === permissionCode);
        if (permissionIndex !== -1) {
          this.finalRole.scopes[indx].permissions.splice(permissionIndex, 1);
          if (this.finalRole.scopes[indx].permissions.length === 0) {
            this.finalRole.scopes.splice(indx, 1);
          }
        }
      }
    }
    console.log('Inside selectPageAndPermission the this.finalRole is :', this.finalRole);
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

    let indx = this.finalRole.scopes.findIndex((item) => item.name === pageName);
    if (isChecked) {
      if (indx !== -1) {
        this.finalRole.scopes[indx].permissions = allPermissions;
      } else {
        this.finalRole.scopes.push({ name: pageName, permissions: allPermissions });
      }
    } else {
      if (indx !== -1) {
        this.finalRole.scopes.splice(indx, 1);
      }
    }
    console.log('Inside sselectAll the this.newScope is :', this.newScope);
  }

  public toggleSelect = function(pageName: string, event: any) {
    console.log('The this.role is :', this.role);
    console.log('The pageName is :', pageName);
    let isChecked = event.target.checked;
    let indx = this.finalRole.scopes.findIndex((page) => page.name === pageName);
    if (indx > -1) {
      this.finalRole.scopes.splice(indx, 1);
    }
    if (this.role.isFresh || 1 === 1) {
      if (isChecked) {
        this.checkBoxes[pageName].view = true;
        this.checkBoxes[pageName].create = true;
        this.checkBoxes[pageName].edit = true;
        this.checkBoxes[pageName].delete = true;
        this.checkBoxes[pageName].share = true;
        this.checkBoxes[pageName].checkAll = true;
        this.finalRole.scopes.push(
          { name: pageName, permissions: [
            { code: this.getPermissionCode('view') },
            { code: this.getPermissionCode('create') },
            { code: this.getPermissionCode('edit') },
            { code: this.getPermissionCode('delete') },
            { code: this.getPermissionCode('share') }]
        });
      } else {
        this.checkBoxes[pageName].view = false;
        this.checkBoxes[pageName].create = false;
        this.checkBoxes[pageName].edit = false;
        this.checkBoxes[pageName].delete = false;
        this.checkBoxes[pageName].share = false;
        this.checkBoxes[pageName].checkAll = false;
      }
    }

    console.log('In toggle select the this.finalRole is :', this.finalRole);
    this.roleToSave.emit(this.finalRole);

    // let indx = this.role.scopes.findIndex((obj) => obj.name === pageName);
    // if (indx !== -1) {
    //   this.role.scopes[indx].permissions.forEach(function (item) {
    //     item.selected = event.target.checked;
    //   });
    // }
    // this.role[pageName].forEach(function (item) {
    //   console.log('Hello the ITEM ', item);
    //   item.selected = event.target.checked;
    // });
  };

  // public ApplyFilters(isValid: boolean) {
  //   let datas = this.neighbourhoods.filter(function (data) { return data.selected == true });
  //   console.log(datas);
  //   if (!isValid) { return; }
  // }

}