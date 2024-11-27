import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { GroupNameComponent } from './group-name.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: GroupNameComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class GroupNameRoutingModule {
}
