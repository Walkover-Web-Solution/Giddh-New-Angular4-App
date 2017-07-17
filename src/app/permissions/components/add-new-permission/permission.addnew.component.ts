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

  private newRole: object = {};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private names: any;
  private selectedAll: any;

  constructor(private router: Router, private store: Store<AppState>, private _location: Location) {
    this.store.select(p => p.permission.newRole).takeUntil(this.destroyed$).subscribe((role) => {
      this.newRole = role;
      console.log("++++++++ Hello the newRole information is :", this.newRole);
      this.names = [
        { name: 'Prashobh', selected: false },
        { name: 'Abraham', selected: false },
        { name: 'Anil', selected: false },
        { name: 'Sam', selected: false },
        { name: 'Natasha', selected: false },
        { name: 'Marry', selected: false },
        { name: 'Zian', selected: false },
        { name: 'karan', selected: false },
      ]
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

  public checkPermission(page, permission) {
    return true;
  }
}