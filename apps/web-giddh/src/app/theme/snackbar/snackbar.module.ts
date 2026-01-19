import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SnackBarComponent } from "./snackbar.component";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        SnackBarComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        SnackBarComponent
    ]
})

/**
 * SnackBarModule module
 * Implements SnackBarModule functionality
 */
export class SnackBarModule {

}