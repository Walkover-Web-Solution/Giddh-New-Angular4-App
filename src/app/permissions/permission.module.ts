import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Ng2BootstrapModule } from 'ngx-bootstrap';

import { PermissionRoutingModule } from './permission.routing.module';
import { PermissionComponent } from './permission.component';
import { PermissionModelComponent } from './model/permission.model.component';
import { AddNewPermissionComponent } from './components/add-new-permission/permission.addnew.component';

console.log('`Permission` bundle loaded asynchronously');

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        PermissionComponent,
        PermissionModelComponent,
        AddNewPermissionComponent
    ],
    exports: [PermissionComponent, PermissionModelComponent, AddNewPermissionComponent, Ng2BootstrapModule],
    imports: [
        CommonModule,
        FormsModule,
        PermissionRoutingModule,
        Ng2BootstrapModule.forRoot()
    ],
})
export class PermissionModule {
}
