import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DummyComponent } from "./dummy.component";

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([ { path: '',
        component: DummyComponent }
    
        ])
    ],
    exports: [
        RouterModule
    ]
})
/**
 * DummyRoutingModule module
 * Implements DummyRoutingModule functionality
 */
export class DummyRoutingModule {
}
