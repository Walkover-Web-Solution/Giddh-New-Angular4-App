import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { AuthHMRCComponent } from './auth-hmrc.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: AuthHMRCComponent, canActivate: [NeedsAuthentication],
            }
        ])
    ],
    exports: [RouterModule]
})
/**
 * AuthHMRCRoutingModule module
 * Implements AuthHMRCRoutingModule functionality
 */
export class AuthHMRCRoutingModule {
}
