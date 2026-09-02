import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
import { GiddhDatepickerModule } from "../../../theme/giddh-datepicker/giddh-datepicker.module";
import { TranslateDirectiveModule } from "../../../theme/translate/translate.directive.module";
import { GiddhPageLoaderModule } from "../../../shared/giddh-page-loader/giddh-page-loader.module";
import { BatchCreateEditComponent } from "./batch-create-edit.component";

@NgModule({
    declarations: [BatchCreateEditComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        FormFieldsModule,
        GiddhDatepickerModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule
    ],
    exports: [BatchCreateEditComponent]
})
export class BatchCreateEditModule { }
