import { NgModule } from "@angular/core";
import { MainComponent } from "./main.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { VouchersRoutingModule } from "./vouchers.routing.module";
import { VoucherListComponent } from "./list/list.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";

@NgModule({
    declarations: [
        MainComponent,
        VoucherListComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        VouchersRoutingModule,
        MatTabsModule,
        MatTableModule
    ],
    exports: [
        
    ]
})
export class VouchersModule {

}