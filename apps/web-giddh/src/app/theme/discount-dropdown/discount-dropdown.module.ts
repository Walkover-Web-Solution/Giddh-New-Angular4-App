import { NgModule } from "@angular/core";
import { DiscountDropdownComponent } from "./discount-dropdown.component";
import { MatMenuModule } from "@angular/material/menu";
import { FormFieldsModule } from "../form-fields/form-fields.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { A11yModule } from "@angular/cdk/a11y";

@NgModule({
    declarations: [
        DiscountDropdownComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        FormFieldsModule,
        MatCheckboxModule,
        A11yModule
    ],
    exports: [
        DiscountDropdownComponent
    ]
})
export class DiscountDropdownModule { }