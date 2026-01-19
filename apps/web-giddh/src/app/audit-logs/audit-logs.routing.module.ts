import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { AuditLogsComponent } from './audit-logs.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: AuditLogsComponent, canActivate: [NeedsAuthentication],
            },
            {
                path: ':version', component: AuditLogsComponent, canActivate: [NeedsAuthentication],
            }
        ])
    ],
    exports: [RouterModule]
})
/**
 * AuditLogsRoutingModule module
 * Implements AuditLogsRoutingModule functionality
 */
export class AuditLogsRoutingModule {
}
