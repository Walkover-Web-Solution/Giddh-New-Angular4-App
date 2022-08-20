import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { ActivityLogsComponent } from './activity-logs.component';

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
export class ActivityLogsRoutingModule {
}
