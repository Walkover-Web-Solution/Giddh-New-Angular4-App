import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { AuditLogsComponent } from './audit-logs.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: AuditLogsComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AuditLogsRoutingModule {
}
