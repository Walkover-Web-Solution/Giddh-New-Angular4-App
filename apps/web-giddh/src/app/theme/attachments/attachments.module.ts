import { NgModule } from "@angular/core";
import { AttachmentsComponent } from "./attachments.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        AttachmentsComponent
    ],
    imports: [
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatListModule,
        CommonModule
    ],
    exports: [
        AttachmentsComponent
    ]
})
export class AttachmentsModule {

}