import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'permission-addnew',
  templateUrl: './permission.addnew.component.html'
})

export class AddNewPermissionComponent {

  private newRole: object = {};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private router: Router, private store: Store<AppState>) {
    this.store.select(p => p.permission.newRole).takeUntil(this.destroyed$).subscribe((role) => {
      this.newRole = role;
      console.log("++++++++ Hello the newRole information is :", this.newRole);
    });
  }
}