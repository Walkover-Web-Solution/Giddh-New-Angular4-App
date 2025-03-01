
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { AmountFieldComponentModule } from "../amount-field/amount-field.module";
import { GiddhTableComponent } from "./giddh-table.component";
import { MatSortModule } from "@angular/material/sort";
import { ClickOutsideModule } from "ng-click-outside";
import { MatInputModule } from "@angular/material/input";

@NgModule({
    declarations: [
        GiddhTableComponent
    ],
    imports: [
        CommonModule,
        MatTableModule,
        AmountFieldComponentModule,
        MatSortModule,
        ClickOutsideModule,
        MatInputModule
    ],
    exports: [
        GiddhTableComponent
    ]
})
export class GiddhTableModule {

}
