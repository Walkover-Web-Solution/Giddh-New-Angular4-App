import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpensesComponent } from './expenses.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        //path: ':expenses-manager', component: ExpensesComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ExpensesRoutingModule {
}
