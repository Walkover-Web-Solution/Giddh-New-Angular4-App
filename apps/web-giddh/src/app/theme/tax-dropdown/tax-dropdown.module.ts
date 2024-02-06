import { NgModule } from "@angular/core";
import { MatSelectModule } from "@angular/material/select";
import { TaxDropdownComponent } from "./tax-dropdown.component";

@NgModule({
    declarations: [
        TaxDropdownComponent
    ],
    imports: [
        MatSelectModule
    ],
    exports: [
        TaxDropdownComponent
    ]
})
export class TaxDropdownModule { }