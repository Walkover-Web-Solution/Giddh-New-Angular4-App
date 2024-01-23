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
        GiddhDatepickerModule
    ],
    exports: [
        
    ]
})
export class VouchersModule {

}