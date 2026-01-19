import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomFieldsCreateEditComponent } from "./create-edit/create-edit.component";
import { CustomFieldsListComponent } from "./list/list.component";
import { MainComponent } from "./main.component";


const routes: Routes = [
    {
        path: "", 
        component: MainComponent,
        children: [
            {
                path: "",
                redirectTo: "list",
                pathMatch: "full"
            },
            {
                path: "list",
                component: CustomFieldsListComponent
            },
            {
                path: "create",
                component: CustomFieldsCreateEditComponent
            },
            {
                path: "edit/:customFieldUniqueName",
                component: CustomFieldsCreateEditComponent
            }
        ]
    }
];

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
/**
 * CustomFieldsRoutingModule module
 * Implements CustomFieldsRoutingModule functionality
 */
export class CustomFieldsRoutingModule {
}