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
import { SharedModule } from '../shared/shared.module';
import { SortByModule } from '../shared/helpers/pipes/sort-by/sort-by.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

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
        SharedModule,
        SortByModule,
        FormFieldsModule,
        MatButtonModule,
        MatCardModule,
        MatListModule,
        MatTooltipModule,
        MatTableModule,
        MatCheckboxModule,
        MatDialogModule,
        MatSelectModule
    ],
    exports: [
        RouterModule,
        CapitalizePipe
    ],
    providers: []
})
export class PermissionRoutingModule {
}
