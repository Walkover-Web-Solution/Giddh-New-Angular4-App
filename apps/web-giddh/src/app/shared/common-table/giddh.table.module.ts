
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { AmountFieldComponentModule } from "../amount-field/amount-field.module";
import { GiddhTableComponent } from "./giddh-table.component";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        GiddhTableComponent
    ],
    imports: [
        CommonModule,
        MatTableModule,
        AmountFieldComponentModule
    ],
    exports: [
        GiddhTableComponent
    ]
})
/**
 * GiddhTableModule module
 * Implements GiddhTableModule functionality
 */
export class GiddhTableModule {

}
