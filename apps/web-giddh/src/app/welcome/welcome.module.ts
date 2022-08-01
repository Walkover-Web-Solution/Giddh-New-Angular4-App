import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { LoaderModule } from "../loader/loader.module";
import { GiddhLayoutModule } from "../shared/layout/layout.module";
import { ShSelectModule } from "../theme/ng-virtual-select/sh-select.module";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { WelcomeComponent } from "./welcome.component";

@NgModule({
    declarations:[
        WelcomeComponent
    ],
    imports: [
        CommonModule,
        GiddhLayoutModule,
        LoaderModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        ShSelectModule,
        BsDropdownModule
    ],
    exports: [
        WelcomeComponent
    ]
})

export class WelcomeModule {

}