import { NgModule } from "@angular/core";
import { AddBulkItemsComponent } from "./add-bulk-items.component";
import { FormFieldsModule } from "../form-fields/form-fields.module";
import { MatListModule } from "@angular/material/list";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { A11yModule } from "@angular/cdk/a11y";
import { TranslateDirectiveModule } from "../translate/translate.directive.module";
import { GiddhNumberFormatPipe } from "../../shared/helpers/pipes/number-format/number-format.pipe";
import { KeyboardShortutModule } from "../../shared/helpers/directives/keyboardShortcut/keyboardShortut.module";
import { KeyboardNavigationModule } from "../../shared/helpers/directives/enter-next/keyboard-navigation.module";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        AddBulkItemsComponent
    ],
    imports: [
        CommonModule,
        FormFieldsModule,
        MatListModule,
        ScrollingModule,
        MatButtonModule,
        MatDialogModule,
        CdkAccordionModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        A11yModule,
        TranslateDirectiveModule,
        KeyboardShortutModule,
        KeyboardNavigationModule
    ],
    exports: [
        AddBulkItemsComponent
    ],
    providers: [
        GiddhNumberFormatPipe
    ]
})
/**
 * AddBulkItemsModule module
 * Implements AddBulkItemsModule functionality
 */
export class AddBulkItemsModule {

}
