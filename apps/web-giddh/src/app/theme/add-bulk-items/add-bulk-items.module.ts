import { NgModule } from "@angular/core";
import { AddBulkItemsComponent } from "./add-bulk-items.component";
import { FormFieldsModule } from "../form-fields/form-fields.module";
import { MatListModule } from "@angular/material/list";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";

@NgModule({
    declarations: [
        AddBulkItemsComponent
    ],
    imports: [
        FormFieldsModule,
        MatListModule,
        ScrollingModule,
        MatButtonModule,
        MatDialogModule,
        MatExpansionModule
    ],
    exports: [
        AddBulkItemsComponent
    ]
})
export class AddBulkItemsModule {
    
}