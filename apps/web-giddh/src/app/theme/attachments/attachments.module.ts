import { NgModule } from "@angular/core";
import { AttachmentsComponent } from "./attachments.component";
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { CommonModule } from "@angular/common";
import { NgxUploaderModule } from "ngx-uploader";
import { NewConfirmModalModule } from "../new-confirm-modal";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { GiddhPageLoaderModule } from "../../shared/giddh-page-loader/giddh-page-loader.module";
import { FormsModule } from "@angular/forms";
import { TranslateDirectiveModule } from "../translate/translate.directive.module";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";

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