
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { AmountFieldComponentModule } from "../amount-field/amount-field.module";
import { GiddhTableComponent } from "./giddh-table.component";

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
export class GiddhTableModule {

}
