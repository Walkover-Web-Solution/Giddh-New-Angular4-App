import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { AuthHMRCComponent } from './auth-hmrc.component';

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
export class AuthHMRCRoutingModule {
}
