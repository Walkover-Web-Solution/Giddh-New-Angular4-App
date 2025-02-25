
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { LaddaModule } from "angular2-ladda";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { CommonTableComponent } from "./common.table.component";
import { MatTable, MatTableModule } from "@angular/material/table";
import { AmountFieldComponentModule } from "../amount-field/amount-field.module";

@NgModule({
    declarations: [
        CommonTableComponent
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
        MatTableModule,
        AmountFieldComponentModule
    ],
    exports: [
        CommonTableComponent
    ]
})
export class CommonTableModule {

}
