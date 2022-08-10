import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HeaderModule } from "../shared/header/header.module";
import { GiddhLayoutModule } from "../shared/layout/layout.module";
import { NewUserComponent } from "./new-user.component";
import { NewUserRoutingModule } from "./new-user.routing.module";

@NgModule({
    declarations: [
        NewUserComponent
    ],
    imports: [
        CommonModule,
        HeaderModule,
        GiddhLayoutModule,
        NewUserRoutingModule
    ]
})

export class NewUserModule {

}