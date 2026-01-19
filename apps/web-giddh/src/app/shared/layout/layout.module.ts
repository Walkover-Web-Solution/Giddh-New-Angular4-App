import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LayoutComponent } from "./layout.component";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        LayoutComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LayoutComponent
    ]
})

/**
 * GiddhLayoutModule module
 * Implements GiddhLayoutModule functionality
 */
export class GiddhLayoutModule {

}