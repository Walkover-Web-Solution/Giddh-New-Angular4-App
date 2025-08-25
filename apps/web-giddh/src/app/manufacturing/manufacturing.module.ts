import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
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
        MatButtonModule,
        ManufacturingRoutingModule,
        SharedModule,
        RouterModule,
        MatTableModule
    ],
})
export class ManufacturingModule {
}
