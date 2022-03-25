import { NgModule } from "@angular/core";
import { AttachmentsComponent } from "./attachments.component";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from "@angular/common";
import { NgxUploaderModule } from "ngx-uploader";
import { NewConfirmModalModule } from "../new-confirm-modal";
import { MatDialogModule } from "@angular/material/dialog";
import { GiddhPageLoaderModule } from "../../shared/giddh-page-loader/giddh-page-loader.module";
import { FormsModule } from "@angular/forms";
import { TranslateDirectiveModule } from "../translate/translate.directive.module";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
    declarations: [
        AttachmentsComponent
    ],
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatListModule,
        CommonModule,
        NgxUploaderModule,
        NewConfirmModalModule,
        GiddhPageLoaderModule,
        FormsModule,
        TranslateDirectiveModule,
        MatDialogModule,
        MatTooltipModule
    ],
    exports: [
        AttachmentsComponent
    ]
})
export class AttachmentsModule {

}