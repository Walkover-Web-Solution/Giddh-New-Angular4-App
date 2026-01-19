import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DummyComponent } from "./dummy.component";
import { DummyRoutingModule } from "./dummy.routing.module";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        DummyComponent
    ],
    imports: [
        CommonModule,
        DummyRoutingModule,
        GiddhPageLoaderModule
    ],
    exports: [
        DummyComponent
    ]
})

/**
 * DummyModule module
 * Implements DummyModule functionality
 */
export class DummyModule {

}
