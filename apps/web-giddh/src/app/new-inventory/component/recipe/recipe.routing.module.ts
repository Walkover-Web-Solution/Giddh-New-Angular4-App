import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { CreateRecipeComponent } from "./create-recipe/create-recipe.component";
import { ListRecipeComponent } from "./list-recipe/list-recipe.component";

const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: "new",
                component: CreateRecipeComponent
            },
            {
                path: "list",
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
export class RecipeRoutingModule {
}
