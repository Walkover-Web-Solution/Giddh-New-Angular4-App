import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { TbPlBsComponent } from './tb-pl-bs.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: TbPlBsComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class TbPlBsRoutingModule {
}
