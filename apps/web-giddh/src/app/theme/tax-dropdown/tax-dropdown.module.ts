import { NgModule } from "@angular/core";
import { TaxDropdownComponent } from "./tax-dropdown.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormFieldsModule } from "../form-fields/form-fields.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { A11yModule } from "@angular/cdk/a11y";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        TaxDropdownComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatCheckboxModule,
        FormFieldsModule,
        MatTooltipModule,
        A11yModule
    ],
    exports: [
        TaxDropdownComponent
    ]
})
/**
 * TaxDropdownModule module
 * Implements TaxDropdownModule functionality
 */
export class TaxDropdownModule {

}