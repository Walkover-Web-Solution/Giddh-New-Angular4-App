import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from '@angular/material/stepper';
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { AddCompanyComponent } from "./add-company.component";
import { AddCompanyRoutingModule } from "./add-company.routing.module";

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
        FormFieldsModule
    ],
    providers: [

    ]
})

export class AddcompanyModule {

}