import { SettingsComponent } from './settings.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { SettingsDeactivateGuard } from './routing-guards/settings-deactivate.guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: SettingsComponent, canActivate: [NeedsAuthentication], canDeactivate: [SettingsDeactivateGuard]
            },
            {
                path: ':type', component: SettingsComponent, canActivate: [NeedsAuthentication], canDeactivate: [SettingsDeactivateGuard]
            },
            {
                path: ':type/:referrer', component: SettingsComponent, canActivate: [NeedsAuthentication], canDeactivate: [SettingsDeactivateGuard]
            }
        ])
    ],
    providers: [SettingsDeactivateGuard],
    exports: [RouterModule]
})
export class SettingRountingModule {
}
