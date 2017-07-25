import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template:  `
<a [routerLink]="['./details']">Details</a>
<a [routerLink]="['./list']">List</a>
<router-outlet></router-outlet>`
})
export class PermissionComponent implements OnInit {
  constructor(private router: Router) {
  }
  public ngOnInit() {
    // this.router.navigateByUrl('./list');
  }
}
