import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from '@angular/material/stepper';
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { HamburgerMenuModule } from "../shared/header/components/hamburger-menu/hamburger-menu.module";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { AddCompanyComponent } from "./add-company.component";
import { AddCompanyRoutingModule } from "./add-company.routing.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ClickOutsideModule } from "ng-click-outside";
import { MatRadioModule } from "@angular/material/radio";

@NgModule({
    declarations: [
        AddCompanyComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        AddCompanyRoutingModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        FormFieldsModule,
        HamburgerMenuModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        MatProgressSpinnerModule,
        ClickOutsideModule,
        MatRadioModule
    ],
    providers: [

    ]
})

export class AddcompanyModule {

}
