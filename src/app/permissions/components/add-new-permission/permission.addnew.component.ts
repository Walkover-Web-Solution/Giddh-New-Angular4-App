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

  constructor(private router: Router,
    private store: Store<AppState>,
    private _location: Location,
    private permissionActions: PermissionActions
  ) {
    this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((role) => {
      this.newRole = role.newRole;
      this.allRoles = role.roles;
    });
  }

  public goToRoles() {
    this._location.back();
  }

  public checkIfAllSelected() {
    this.selectedAll = this.names.every(function (item: any) {
      return item.selected === true;
    });
  }

  public addNewRole(): any {
    // this.newRole.scopes = this.newScope;
    this.store.dispatch(this.permissionActions.SaveNewRole(this.newRole));
    this.router.navigate(['/pages', 'permissions']);
  }

}
