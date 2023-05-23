import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateRecipeComponent } from "../recipe/create-recipe/create-recipe.component";
import { ListRecipeComponent } from "../recipe/list-recipe/list-recipe.component";
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
            },
            {
                path: ":type/create-recipe",
                component: CreateRecipeComponent
            },
            {
                path: ":type/list-recipe",
                component: ListRecipeComponent
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
