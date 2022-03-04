import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StockCreateEditComponent } from "./stock-create-edit.component";

const routes: Routes = [
    {
        path: "", component: StockCreateEditComponent,
        children: [
            {
                path: "",
                redirectTo: "create",
                pathMatch: "full"
            },
            {
                path: "create",
                component: StockCreateEditComponent
            },
            {
                path: "edit/:stockUniqueName",
                component: StockCreateEditComponent
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StockCreateEditRoutingModule {
}