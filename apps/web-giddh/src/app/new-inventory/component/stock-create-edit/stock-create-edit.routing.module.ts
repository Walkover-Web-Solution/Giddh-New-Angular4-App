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
                path: "product/create",
                component: StockCreateEditComponent
            },
            {
                path: "service/create",
                component: StockCreateEditComponent
            },
            {
                path: "fixedassets/create",
                component: StockCreateEditComponent
            },
            {
                path: "product/edit/:stockUniqueName",
                component: StockCreateEditComponent
            },
            {
                path: "service/edit/:stockUniqueName",
                component: StockCreateEditComponent
            },
            {
                path: "fixedassets/edit/:stockUniqueName",
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
