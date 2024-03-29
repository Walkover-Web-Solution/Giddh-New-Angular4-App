import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoaderModule } from "../loader/loader.module";
import { HeaderModule } from "../shared/header/header.module";
import { GiddhLayoutModule } from "../shared/layout/layout.module";
import { PageComponent } from "./page.component";
import { PageRoutingModule } from "./page.routing.module";

@NgModule({
    declarations: [
        PageComponent
    ],
    imports: [
        CommonModule,
        PageRoutingModule,
        RouterModule,
        GiddhLayoutModule,
        LoaderModule,
        HeaderModule
    ],
    exports: [
        PageComponent
    ]
})

export class PageModule {

}