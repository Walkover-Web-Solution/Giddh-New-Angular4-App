import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { StockCreateEditComponent } from "./stock-create-edit.component";
const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [

            {
                path: ":type/create",
                component: StockCreateEditComponent
            },
            {
                path: ":type/edit/:stockUniqueName",
                component: StockCreateEditComponent
            }

        ]
    },
    
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StockCreateEditRoutingModule {
}
