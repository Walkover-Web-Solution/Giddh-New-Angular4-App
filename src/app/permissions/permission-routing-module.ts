import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionComponent } from './permission.component';
import { PermissionListComponent } from './components/list/permission.list.component';
import { PermissionDetailsComponent } from './components/details/permission.details.component';
import { DeleteRoleConfirmationModelComponent } from './components/confirmation/confirmation.model.component';
import { PermissionModelComponent } from './components/model/permission.model.component';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';

const PERMISSION_ROUTES: Routes = [
  {
    path: '',
    component: PermissionComponent,
    children: [
      {
        path: 'list',
        component: PermissionListComponent,
        canActivate: [NeedsAuthentication]
      },
      {
        path: 'details',
        component: PermissionDetailsComponent,
        canActivate: [NeedsAuthentication]
      },
      // {
      //   path: 'details/:id',
      //   component: PermissionDetailsComponent,
      //   canActivate: [NeedsAuthentication]
      // },
      { path: '*', redirectTo: 'list'}
    ]
  }
];

@NgModule({
  declarations: [
    PermissionComponent,
    PermissionListComponent,
    PermissionDetailsComponent,
    PermissionModelComponent,
    DeleteRoleConfirmationModelComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(PERMISSION_ROUTES),
    Ng2BootstrapModule.forRoot()
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class PermissionRoutingModule { }
