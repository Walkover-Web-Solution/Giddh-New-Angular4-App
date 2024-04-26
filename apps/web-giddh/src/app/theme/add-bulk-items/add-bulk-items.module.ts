import { NgModule } from "@angular/core";
import { AddBulkItemsComponent } from "./add-bulk-items.component";
import { FormFieldsModule } from "../form-fields/form-fields.module";
import { MatListModule } from "@angular/material/list";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateDirectiveModule } from "../translate/translate.directive.module";

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
        MatExpansionModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateDirectiveModule
    ],
    exports: [
        AddBulkItemsComponent
    ]
})
export class AddBulkItemsModule {
    
}