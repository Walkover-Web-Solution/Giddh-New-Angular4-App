
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { ShSelectModule } from "../../theme/ng-virtual-select/sh-select.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CreateAddressComponent } from "./create-address.component";
import { LaddaModule } from "angular2-ladda";

@NgModule({
    declarations: [
        CreateAddressComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateDirectiveModule,
        ScrollingModule,
        MatButtonModule,
        FormFieldsModule,
        ShSelectModule,
        LaddaModule
    ],
    exports: [
        CreateAddressComponent
    ]
})
export class CreateAddressModule {

}
