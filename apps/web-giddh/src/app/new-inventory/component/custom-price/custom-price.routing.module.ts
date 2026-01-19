import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerWiseComponent } from "./customer-wise/customer-wise.component";
import { MainComponent } from "./main.component";

const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [            
            {
                path: ":type",
                pathMatch: 'full',
                component: CustomerWiseComponent
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
 * CustomPriceRoutingModule module
 * Implements CustomPriceRoutingModule functionality
 */
export class CustomPriceRoutingModule {
}
