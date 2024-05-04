import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { UserDetailsComponent } from './user-details.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: ':type', component: UserDetailsComponent, canActivate: [NeedsAuthentication] },
            { path: '', component: UserDetailsComponent, canActivate: [NeedsAuthentication] }
        ])
    ],
    exports: [RouterModule]
})
export class UserDetailsRoutingModule {
}
