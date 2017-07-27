import { Component, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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
  templateUrl: './permission.details.html'
})

export class PermissionDetailsComponent {
  public allRoles: any;
  private newRole: any = {};
  private roleToSave: any = {};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private names: any;
  // private selectedAll: any;
  private transactionMode: string;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private _location: Location,
    private permissionActions: PermissionActions
  ) {

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
      console.log('The role is :******', this.newRole);
      // this.allRoles = permission.roles;
    });
  }

  public goToRoles() {
    this._location.back();
  }

  // public checkIfAllSelected() {
  //   this.selectedAll = this.names.every(function (item: any) {
  //     return item.selected === true;
  //   });
  // }

  public onPermissionSelection(data) {
    this.roleToSave = data;
  }

  public addNewRole(): any {
    if (this.transactionMode === 'create') {
      this.store.dispatch(this.permissionActions.SaveNewRole(this.roleToSave));
    }else if (this.transactionMode === 'update') {
      this.store.dispatch(this.permissionActions.UpdateRole(this.roleToSave));
    }
    this.router.navigate(['/pages', 'permissions', 'list']);
  }

}
