import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { GroupNameComponent } from './group-name.component';

/**
 * Handles NgModule functionality
 */
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
/**
 * GroupNameRoutingModule module
 * Implements GroupNameRoutingModule functionality
 */
export class GroupNameRoutingModule {
}
