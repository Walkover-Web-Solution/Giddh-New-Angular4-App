import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BasicTriggerComponent } from './components/basic-trigger/basic-trigger.component';
import { AdvanceTriggerComponent } from './components/advance-trigger/advance-trigger.component';
import { NeedsAuthentication } from '../../decorators/needsAuthentication';
import { NeedsAuthorization } from '../../decorators/needAuthorization';
import { TriggersComponent } from './triggers.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', 
                pathMatch: 'full',
                component: TriggersComponent, 
                canActivate: [NeedsAuthentication, NeedsAuthorization]
            },
            {
                path: 'basic', 
                component: BasicTriggerComponent,
                canActivate: [NeedsAuthentication]
            },
            {
                path: 'advance', 
                component: AdvanceTriggerComponent,
                canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class TriggersRoutingModule {
}
