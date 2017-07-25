import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { PermissionComponent } from './permission.component';
import { PermissionModelComponent } from './model/permission.model.component';
import { PermissionDetailsComponent } from './components/details/permission.details.component';
import { DeleteRoleConfirmationModelComponent } from './model/confirmation/confirmation.model.component';
import { SelectRoleTableComponent } from './components/add-new-permission/table/table.component';
import { PermissionRoutingModule } from './permission-routing-module';
import { PermissionParentComponent } from './permission.parent.component';

@NgModule({
    declarations: [
        PermissionParentComponent,
        PermissionComponent,
        PermissionModelComponent,
        DeleteRoleConfirmationModelComponent,
        PermissionDetailsComponent,
        SelectRoleTableComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        PermissionRoutingModule
    ],
})
export class PermissionModule {}
