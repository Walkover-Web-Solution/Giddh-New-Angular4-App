import { NgModule } from "@angular/core";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { DummyComponent } from "./dummy.component";
import { DummyRoutingModule } from "./dummy.routing.module";

@NgModule({
    declarations: [
        DummyComponent
    ],
    imports: [
        GiddhPageLoaderModule,
        DummyRoutingModule
    ],
    exports: [
        DummyComponent
    ]
})

export class DummyModule {

}