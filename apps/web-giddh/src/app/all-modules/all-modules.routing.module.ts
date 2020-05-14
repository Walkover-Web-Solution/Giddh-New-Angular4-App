import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { AllModulesComponent } from './all-modules.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: AllModulesComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AllModulesRoutingModule {
}
