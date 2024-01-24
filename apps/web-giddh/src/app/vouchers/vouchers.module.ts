import { NgModule } from "@angular/core";
import { MainComponent } from "./main.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { VouchersRoutingModule } from "./vouchers.routing.module";
import { VoucherListComponent } from "./list/list.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { VoucherCreateComponent } from "./create/create.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { GiddhDatepickerModule } from "../theme/giddh-datepicker/giddh-datepicker.module";
import { MatSelectModule } from "@angular/material/select";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

@NgModule({
    declarations: [
        MainComponent,
        VoucherListComponent,
        VoucherCreateComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        FormFieldsModule,
        VouchersRoutingModule,
        MatTabsModule,
        MatTableModule,
        MatCheckboxModule,
        GiddhDatepickerModule,
        MatSelectModule,
        MatMenuModule,
        MatRadioModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        NgxMatSelectSearchModule
    ],
    exports: [
        
    ]
})
export class VouchersModule {

}