import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionComponent } from './permission.component';
import { PageComponent } from '../page.component';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';
import { AddNewPermissionComponent } from './components/add-new-permission/permission.addnew.component';

@NgModule({
    imports: [
        // RouterModule.forChild([
        //     { path: 'permissions', component: PermissionComponent },
        //     { path: 'add-new-permission', pathMatch: 'full', component: AddNewPermissionComponent, canActivate: [NeedsAuthentication] }
        // ])

        RouterModule.forChild([
            { path: 'permissions', redirectTo: 'pages/permissions', pathMatch: 'full', canActivate: [NeedsAuthentication] },
            {
                path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
                children: [
                    {
                        path: 'permissions', component: PermissionComponent, canActivate: [NeedsAuthentication],
                        children: [
                            { path: 'add-new', pathMatch: 'full', component: AddNewPermissionComponent, canActivate: [NeedsAuthentication] },
                        ]
                    }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class PermissionRoutingModule { }
