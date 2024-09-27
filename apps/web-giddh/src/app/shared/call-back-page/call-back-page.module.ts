import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GiddhPageLoaderModule } from "../giddh-page-loader/giddh-page-loader.module";
import { CallBackPageComponent } from "./call-back-page.component";



@NgModule({
    declarations: [
        CallBackPageComponent
    ],
    exports: [
        CallBackPageComponent
    ],
    imports: [
        CommonModule,
        GiddhPageLoaderModule
    ],
    providers: [
    ]
})
export class CallBackPageModule {
}
