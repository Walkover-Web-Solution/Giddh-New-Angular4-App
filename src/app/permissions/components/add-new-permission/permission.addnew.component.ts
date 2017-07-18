import { Component, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export interface InewRole {
  name: string,
  copyoption: string,
  pages: any[],
  scopes: any[],
}

@Component({
  selector: 'permission-addnew',
  templateUrl: './permission.addnew.component.html'
})

export class AddNewPermissionComponent {

  private newRole: any = {};
  public allRoles: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private names: any;
  private selectedAll: any;

  constructor(private router: Router, private store: Store<AppState>, private _location: Location) {
    this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((role) => {
      this.newRole = role.newRole;
      this.allRoles = role.roles;
      console.log("++++++++ Hello the newRole information is :", this.newRole);
      console.log("++++++++ Hello the allRoles information is :", this.allRoles);
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

  public selectAll() {
    for (var i = 0; i < this.names.length; i++) {
      this.names[i].selected = this.selectedAll;
    }
  }
  public checkIfAllSelected() {
    this.selectedAll = this.names.every(function (item: any) {
      return item.selected == true;
    })
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
}
