import { NgModule } from "@angular/core";
import { AddBulkItemsComponent } from "./add-bulk-items.component";
// import { FormFieldsModule } from "../form-fields/form-fields.module";
// Temporarily disabled;
import { MatListModule } from "@angular/material/list";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateDirectiveModule } from "../translate/translate.directive.module";
import { GiddhNumberFormatPipe } from "../../shared/helpers/pipes/number-format/number-format.pipe";
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        AddBulkItemsComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        ScrollingModule,
        MatButtonModule,
        MatDialogModule,
        MatExpansionModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateDirectiveModule
    
    ],
    exports: [
        AddBulkItemsComponent
    ],
    providers: [
        GiddhNumberFormatPipe
    
    ]
})
export class AddBulkItemsModule {

}
