import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoaderComponent } from "./loader.component";

@NgModule({
    declarations: [
        LoaderComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        LoaderComponent
    ]
})

export class LoaderModule {

}