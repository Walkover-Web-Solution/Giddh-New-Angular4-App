import { NgModule } from "@angular/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { VerifyEmailComponent } from "./verify-email.component";
import { VerifyEmailRoutingModule } from "./verify-email.routing.module";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        VerifyEmailComponent
    ],
    imports: [
        GiddhPageLoaderModule,
        VerifyEmailRoutingModule,
        MatSnackBarModule
    ]
})
/**
 * VerifyEmailModule module
 * Implements VerifyEmailModule functionality
 */
export class VerifyEmailModule {

}