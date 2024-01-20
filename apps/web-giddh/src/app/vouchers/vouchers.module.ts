import { NgModule } from "@angular/core";
import { MainComponent } from "./main.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { VouchersRoutingModule } from "./vouchers.routing.module";
import { VouchersListComponent } from "./list/list.component";

@NgModule({
    declarations: [
        MainComponent,
        VouchersListComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        VouchersRoutingModule
    ],
    exports: [
        
    ]
})
export class VouchersModule {

}