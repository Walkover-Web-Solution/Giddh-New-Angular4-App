import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
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
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class PageModule {

}
