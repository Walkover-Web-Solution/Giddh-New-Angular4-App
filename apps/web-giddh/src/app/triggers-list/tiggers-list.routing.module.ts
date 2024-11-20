import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { TriggersListComponent } from './triggers-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: TriggersListComponent, canActivate: [NeedsAuthentication],
            }
        ])
    ],
    exports: [RouterModule]
})
export class TriggersListRoutingModule {
}
