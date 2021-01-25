import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { HamburgerMenuComponentModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { SharedModule } from '../shared/shared.module';
import { CapitalizePipe } from './capitalize.pipe';
import { DeleteRoleConfirmationModelComponent } from './components/confirmation/confirmation.model.component';
import { PermissionDetailsComponent } from './components/details/permission.details.component';
import { PermissionListComponent } from './components/list/permission.list.component';
import { PermissionModelComponent } from './components/model/permission.model.component';
import { PermissionComponent } from './permission.component';
import { SortByPipe } from './sort.pipe';

const PERMISSION_ROUTES: Routes = [
    { path: '', redirectTo: 'pages/permissions/list', pathMatch: 'full' },
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
        RouterModule.forChild(PERMISSION_ROUTES),
        LaddaModule,
        ModalModule,
        BsDropdownModule,
        SharedModule,
        HamburgerMenuComponentModule
    ],
    exports: [
        RouterModule,
        CapitalizePipe
    ],
    providers: []
})
export class PermissionRoutingModule {
}
