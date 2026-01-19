import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { ProjectWiseAccountingListComponent } from './list/project-wise-accounting.component';
import { RevenueExpenseListComponent } from './revenue-expense-list/revenue-expense-list.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
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
                        component: ProjectWiseAccountingListComponent
                    },
                    {
                        path: ":module/list/:uniqueName",
                        component: RevenueExpenseListComponent
                    }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
/**
 * ProjectWiseAccountingRoutingModule module
 * Implements ProjectWiseAccountingRoutingModule functionality
 */
export class ProjectWiseAccountingRoutingModule { }