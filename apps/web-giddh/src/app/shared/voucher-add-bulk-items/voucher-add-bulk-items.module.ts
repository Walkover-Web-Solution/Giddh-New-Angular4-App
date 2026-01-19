import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { VoucherAddBulkItemsComponent } from "./voucher-add-bulk-items.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        VoucherAddBulkItemsComponent
    ],
    imports: [
        CommonModule,
        FormFieldsModule,
        MatListModule,
        ScrollingModule,
        MatButtonModule,
        MatDialogModule,
        MatExpansionModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        MatInputModule,
        MatFormFieldModule
    ],
    exports: [
        VoucherAddBulkItemsComponent
    ]
})
/**
 * VoucherAddBulkItemsModule module
 * Implements VoucherAddBulkItemsModule functionality
 */
export class VoucherAddBulkItemsModule {

}
