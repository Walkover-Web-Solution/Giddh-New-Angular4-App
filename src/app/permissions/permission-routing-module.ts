import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionComponent } from './permission.component';
import { PermissionListComponent } from './components/list/permission.list.component';
import { PermissionDetailsComponent } from './components/details/permission.details.component';
import { SelectRoleTableComponent } from './components/table/table.component';
import { DeleteRoleConfirmationModelComponent } from './components/confirmation/confirmation.model.component';
import { PermissionModelComponent } from './components/model/permission.model.component';

const PERMISSION_ROUTES: Routes = [
  {
    path: '',
    component: PermissionComponent,
    children: [
      {
        path: 'list',
        component: PermissionListComponent,
      },
      {
        path: 'details',
        component: PermissionDetailsComponent,
      }
    ]
  }
  // { path: '**', redirectTo: 'list' }
];

@NgModule({
  declarations: [
    PermissionComponent,
    PermissionListComponent,
    PermissionDetailsComponent,
    PermissionModelComponent,
    DeleteRoleConfirmationModelComponent,
    SelectRoleTableComponent
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
