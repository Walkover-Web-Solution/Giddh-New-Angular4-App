import { NgModule } from "@angular/core";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { DummyComponent } from "./dummy.component";

@NgModule({
    declarations: [
        DummyComponent
    ],
    imports: [
        GiddhPageLoaderModule
    ],
    exports: [
        DummyComponent
    ]
})

export class DummyModule {

}