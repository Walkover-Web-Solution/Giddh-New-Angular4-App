import { NgModule } from "@angular/core";
import { FormFieldsModule } from "../form-fields/form-fields.module";
import { MatButtonModule } from "@angular/material/button";
import { CreateDiscountComponent } from "./create-discount.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LaddaModule } from "angular2-ladda";
import { TranslateDirectiveModule } from "../translate/translate.directive.module";

@NgModule({
    declarations: [
        CreateDiscountComponent
    ],
    imports: [
        CommonModule,
        FormFieldsModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        LaddaModule,
        TranslateDirectiveModule
    ],
    exports: [
        CreateDiscountComponent
    ]
})
export class CreateDiscountModule {
    
}