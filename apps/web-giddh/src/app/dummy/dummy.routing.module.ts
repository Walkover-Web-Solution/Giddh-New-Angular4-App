import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DummyComponent } from "./dummy.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: DummyComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class DummyRoutingModule {
}
