import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClickOutsideModule } from "ng-click-outside";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { LoaderModule } from "../loader/loader.module";
import { GiddhLayoutModule } from "../shared/layout/layout.module";
import { ShSelectModule } from "../theme/ng-virtual-select/sh-select.module";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { WelcomeComponent } from "./welcome.component";
import { WelcomeRoutingModule } from "./welcome.routing.module";

@NgModule({
    declarations:[
        WelcomeComponent
    ],
    imports: [
        CommonModule,
        WelcomeRoutingModule,
        GiddhLayoutModule,
        LoaderModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        ShSelectModule,
        BsDropdownModule.forRoot(),
        ClickOutsideModule
    ],
    exports: [
        WelcomeComponent
    ]
})

export class WelcomeModule {

}