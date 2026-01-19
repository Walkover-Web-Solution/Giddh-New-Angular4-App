import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { ActivityLogsComponent } from './activity-logs.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: ActivityLogsComponent, canActivate: [NeedsAuthentication],
            }
        ])
    ],
    exports: [RouterModule]
})
/**
 * ActivityLogsRoutingModule module
 * Implements ActivityLogsRoutingModule functionality
 */
export class ActivityLogsRoutingModule {
}
