import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoaderComponent } from "./loader.component";

/**
 * Handles NgModule functionality
 */
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

/**
 * LoaderModule module
 * Implements LoaderModule functionality
 */
export class LoaderModule {

}