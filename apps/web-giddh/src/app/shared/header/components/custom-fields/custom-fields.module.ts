import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LaddaModule } from "angular2-ladda";
import { ShSelectModule } from "apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.module";
import { TranslateDirectiveModule } from "apps/web-giddh/src/app/theme/translate/translate.directive.module";
import { ModalModule } from "ngx-bootstrap/modal";
import { CustomFieldsComponent } from "./custom-fields.component";


@NgModule({
    declarations: [
        CustomFieldsComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        ShSelectModule,
        FormsModule,
        ReactiveFormsModule,
        LaddaModule,
        ModalModule
    ],
    exports: [
        CustomFieldsComponent
    ]
})

export class CustomFieldsModule {
    
}