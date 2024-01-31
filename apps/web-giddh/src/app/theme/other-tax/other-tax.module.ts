import { NgModule } from "@angular/core";
import { OtherTaxComponent } from "./other-tax.component";
import { FormFieldsModule } from "../form-fields/form-fields.module";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
    declarations: [
        OtherTaxComponent
    ],
    imports: [
        FormFieldsModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule
    ],
    exports: [
        OtherTaxComponent
    ]
})
export class OtherTaxModule {
    
}