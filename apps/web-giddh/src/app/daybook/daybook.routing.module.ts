import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { DaybookComponent } from 'apps/web-giddh/src/app/daybook/daybook.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: DaybookComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class DaybookRoutingModule {
}
