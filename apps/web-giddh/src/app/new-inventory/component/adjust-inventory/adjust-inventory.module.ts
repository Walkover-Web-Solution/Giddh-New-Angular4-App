import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { SharedModule } from "../../../shared/shared.module";
import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
import { TranslateDirectiveModule } from "../../../theme/translate/translate.directive.module";
import { GiddhPageLoaderModule } from "../../../shared/giddh-page-loader/giddh-page-loader.module";
import { AmountFieldComponentModule } from "../../../shared/amount-field/amount-field.module";
import { HamburgerMenuModule } from "../../../shared/header/components/hamburger-menu/hamburger-menu.module";
import { AdjustInventoryComponent } from "./adjust-inventory.component";
import { AsideCreateNewReasonComponent } from "../aside-create-reason/aside-create-reason.component";

@NgModule({
    declarations: [
        AdjustInventoryComponent,
        AsideCreateNewReasonComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        FormFieldsModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        AmountFieldComponentModule,
        HamburgerMenuModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule
    ],
    exports: [
        AdjustInventoryComponent
    ]
})
export class AdjustInventoryModule { }
