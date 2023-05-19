import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DeleteTemplateConfirmationModelComponent } from "./confirmation.modal.component";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule
    ],
    declarations: [
        DeleteTemplateConfirmationModelComponent
    ],
    exports: [
        DeleteTemplateConfirmationModelComponent
    ]
})

export class DeleteTemplateConfirmationModalModule {

}