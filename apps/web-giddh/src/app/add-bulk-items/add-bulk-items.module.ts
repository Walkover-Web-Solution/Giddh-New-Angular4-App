import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { AddBulkItemsComponent } from "./add-bulk-items.component";

@NgModule({
    declarations: [
        AddBulkItemsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateDirectiveModule,
        MatButtonModule,
        FormFieldsModule,
    ],
    exports: [
        AddBulkItemsComponent
    ]
})

export class AddBulkItemsModule {

}