import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionComponent } from './permission.component';
import { PermissionParentComponent } from './permission.parent.component';
import { PermissionDetailsComponent } from './components/details/permission.details.component';


const PERMISSION_ROUTES: Routes = [
  {
    path: '',
    component: PermissionParentComponent,
    children: [
      {
        path: 'list',
        component: PermissionComponent,
      },
      {
        path: 'details',
        component: PermissionDetailsComponent,
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(PERMISSION_ROUTES)
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class PermissionRoutingModule { }
