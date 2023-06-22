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
import { CapitalizePipe } from './capitalize.pipe';
import { LaddaModule } from 'angular2-ladda';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../shared/shared.module';
import { SortByModule } from '../shared/helpers/pipes/sort-by/sort-by.module';

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
            }
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
        CapitalizePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(PERMISSION_ROUTES),
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ModalModule,
        BsDropdownModule.forRoot(),
        SharedModule,
        SortByModule
    ],
    exports: [
        RouterModule,
        CapitalizePipe
    ],
    providers: []
})
export class PermissionRoutingModule {
}
