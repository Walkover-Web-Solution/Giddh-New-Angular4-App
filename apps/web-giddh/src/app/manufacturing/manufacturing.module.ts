import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MfEditComponent } from './edit/mf.edit.component';
import { DeleteManufacturingConfirmationModelComponent } from './edit/modal/confirmation.model.component';
import { ManufacturingComponent } from './manufacturing.component';
import { ManufacturingRoutingModule } from './manufacturing.routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        ManufacturingComponent,
        MfEditComponent,
        DeleteManufacturingConfirmationModelComponent
    ],
    exports: [RouterModule],
    providers: [],
    imports: [
        ManufacturingRoutingModule,
        SharedModule,
        RouterModule
    ],
})
export class ManufacturingModule {
}
