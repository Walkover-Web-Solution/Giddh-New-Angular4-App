import { NgModule } from "@angular/core";
import { OtherTaxComponent } from "./other-tax.component";
import { FormFieldsModule } from "../form-fields/form-fields.module";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AsideMenuCreateTaxModule } from "../../shared/aside-menu-create-tax/aside-menu-create-tax.module";
import { TranslateDirectiveModule } from "../translate/translate.directive.module";

@NgModule({
    declarations: [
        OtherTaxComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormFieldsModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule,
        AsideMenuCreateTaxModule,
        TranslateDirectiveModule
    ],
    exports: [
        OtherTaxComponent
    ]
})
export class OtherTaxModule {

}