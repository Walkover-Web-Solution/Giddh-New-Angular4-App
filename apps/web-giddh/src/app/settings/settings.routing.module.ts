import { SettingsComponent } from './settings.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { SettingsDeactivateGuard } from './routing-guards/settings-deactivate.guard';
import { CreateBranchComponent } from './branch/create-branch/create-branch.component';
import { CreateWarehouseComponent } from './warehouse/create-warehouse/create-warehouse.component';
import { NeedsAuthorization } from '../decorators/needAuthorization';
import { PageLeaveConfirmationGuard } from '../decorators/page-leave-confirmation-guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: SettingsComponent, canActivate: [NeedsAuthentication, NeedsAuthorization], canDeactivate: [SettingsDeactivateGuard], pathMatch: 'full'
            },
            {
                path: 'create-branch', component: CreateBranchComponent, canActivate: [NeedsAuthentication, NeedsAuthorization], canDeactivate: [SettingsDeactivateGuard, PageLeaveConfirmationGuard]
            },
            {
                path: 'create-warehouse', component: CreateWarehouseComponent, canActivate: [NeedsAuthentication, NeedsAuthorization], canDeactivate: [SettingsDeactivateGuard, PageLeaveConfirmationGuard]
            },
            {
                path: ':type', component: SettingsComponent, canActivate: [NeedsAuthentication, NeedsAuthorization], canDeactivate: [SettingsDeactivateGuard, PageLeaveConfirmationGuard]
            },
            {
                path: ':type/:referrer', component: SettingsComponent, canActivate: [NeedsAuthentication, NeedsAuthorization], canDeactivate: [SettingsDeactivateGuard, PageLeaveConfirmationGuard]
            }
        ])
    ],
    providers: [SettingsDeactivateGuard],
    exports: [RouterModule]
})
export class SettingRountingModule {
}
