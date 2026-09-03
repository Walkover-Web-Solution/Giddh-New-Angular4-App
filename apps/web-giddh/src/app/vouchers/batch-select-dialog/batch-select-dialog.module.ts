import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { BatchCreateEditModule } from "../../new-inventory/component/batch-create-edit/batch-create-edit.module";
import { GiddhPageLoaderModule } from "../../shared/giddh-page-loader/giddh-page-loader.module";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { BatchSelectDialogComponent } from "./batch-select-dialog.component";

@NgModule({
    declarations: [BatchSelectDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        FormFieldsModule,
        GiddhPageLoaderModule,
        BatchCreateEditModule
    ],
    exports: [BatchSelectDialogComponent]
})
export class BatchSelectDialogModule { }
