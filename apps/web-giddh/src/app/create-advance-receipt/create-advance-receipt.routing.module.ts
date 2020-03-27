import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateAdvanceReceiptComponent } from './create-advance-receipt.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: CreateAdvanceReceiptComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class CreateAdvanceReceiptRoutingModule {
}
