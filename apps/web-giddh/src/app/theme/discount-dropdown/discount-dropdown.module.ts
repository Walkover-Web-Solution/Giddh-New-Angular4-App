import { NgModule } from "@angular/core";
import { DiscountDropdownComponent } from "./discount-dropdown.component";
import { MatMenuModule } from "@angular/material/menu";
import { FormFieldsModule } from "../form-fields/form-fields.module";
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
    declarations: [
        DiscountDropdownComponent
    ],
    imports: [
        MatMenuModule,
        FormFieldsModule,
        MatCheckboxModule
    ],
    exports: [
        DiscountDropdownComponent
    ]
})
export class DiscountDropdownModule { }