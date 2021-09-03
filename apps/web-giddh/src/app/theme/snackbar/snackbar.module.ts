import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SnackBarComponent } from "./snackbar.component";

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

export class SnackBarModule {

}