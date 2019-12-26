import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionComponent } from './permission.component';
import { PermissionListComponent } from './components/list/permission.list.component';
import { PermissionDetailsComponent } from './components/details/permission.details.component';
import { DeleteRoleConfirmationModelComponent } from './components/confirmation/confirmation.model.component';
import { PermissionModelComponent } from './components/model/permission.model.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { SortByPipe } from './sort.pipe';
import { CapitalizePipe } from './capitalize.pipe';
import { LaddaModule } from 'angular2-ladda';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';

const PERMISSION_ROUTES: Routes = [
    { path: '', redirectTo: 'pages/permissions/list', pathMatch: 'full', canActivate: [NeedsAuthentication] },
    {
        path: '',
        component: PermissionComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'list' },
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
            // { path: '*', redirectTo: 'list' }
        ]
    }
];

@NgModule({
    declarations: [
        PermissionComponent,
        PermissionListComponent,
        PermissionDetailsComponent,
        PermissionModelComponent,
        DeleteRoleConfirmationModelComponent,
        SortByPipe,
        CapitalizePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(PERMISSION_ROUTES),
        LaddaModule,
        ModalModule,
        BsDropdownModule
    ],
    exports: [
        RouterModule,
        CapitalizePipe
    ],
    providers: []
})
export class PermissionRoutingModule {
}
