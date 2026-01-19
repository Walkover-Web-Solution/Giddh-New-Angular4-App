
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CreateAddressComponent } from "./create-address.component";
import { LaddaModule } from "angular2-ladda";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatCheckboxModule } from "@angular/material/checkbox";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        CreateAddressComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateDirectiveModule,
        ScrollingModule,
        MatButtonModule,
        FormFieldsModule,
        LaddaModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        MatCheckboxModule
    ],
    exports: [
        CreateAddressComponent
    ]
})
/**
 * CreateAddressModule module
 * Implements CreateAddressModule functionality
 */
export class CreateAddressModule {

}