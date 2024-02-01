import { NgModule } from "@angular/core";
import { FormFieldsModule } from "../form-fields/form-fields.module";
import { MatButtonModule } from "@angular/material/button";
import { CreateDiscountComponent } from "./create-discount.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
    declarations: [
        CreateDiscountComponent
    ],
    imports: [
        FormFieldsModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule
    ],
    exports: [
        CreateDiscountComponent
    ]
})
export class CreateDiscountModule {
    
}