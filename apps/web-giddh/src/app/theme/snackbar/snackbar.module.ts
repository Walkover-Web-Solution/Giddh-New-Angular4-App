import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SnackbarComponent } from "./snackbar.component";

@NgModule({
    declarations: [
        SnackbarComponent
    
    ],
    imports: [
        CommonModule
    
    ],
    exports: [
        SnackbarComponent
    
    ]
})

export class SnackBarModule {

}