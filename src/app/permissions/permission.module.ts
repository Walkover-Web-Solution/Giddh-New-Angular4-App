import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Ng2BootstrapModule } from 'ngx-bootstrap';

import { PermissionRoutingModule } from './permission.routing.module';
import { PermissionComponent } from './permission.component';
import { PermissionModelComponent } from './model/permission.model.component';

console.log('`Permission` bundle loaded asynchronously');

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        PermissionComponent,
        PermissionModelComponent
    ],
    exports: [PermissionComponent, PermissionModelComponent, Ng2BootstrapModule],
    imports: [
        CommonModule,
        FormsModule,
        PermissionRoutingModule,
        Ng2BootstrapModule.forRoot()
    ],
})
export class PermissionModule {
}
