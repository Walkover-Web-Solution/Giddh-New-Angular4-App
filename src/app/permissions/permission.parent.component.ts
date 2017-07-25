import { Component } from '@angular/core';

@Component({
  template:  `<h1>Permission Parent Component</h1>
<a [routerLink]="['./details']">Details</a>
<a [routerLink]="['./list']">List</a>
<router-outlet></router-outlet>`
})
export class PermissionParentComponent {}
