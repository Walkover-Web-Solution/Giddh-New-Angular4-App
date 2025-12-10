import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MfEditComponent } from './edit/mf.edit.component';
import { DeleteManufacturingConfirmationModelComponent } from './edit/modal/confirmation.model.component';
import { ManufacturingComponent } from './manufacturing.component';
import { ManufacturingRoutingModule } from './manufacturing.routing.module';
// import { SharedModule } from '../shared/shared.module';
// import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatDialogModule } from '@angular/material/dialog';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        ManufacturingComponent,
        MfEditComponent,
        DeleteManufacturingConfirmationModelComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    exports: [
        RouterModule
    ],
    providers: [],
    imports: [
        MatButtonModule,
        ManufacturingRoutingModule,
        RouterModule,
        MatTableModule,
        MatDialogModule
    
    ]
})
export class ManufacturingModule {
}
