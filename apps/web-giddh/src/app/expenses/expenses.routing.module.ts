import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpensesComponen } from './expenses.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':expenses-manager', component: ExpensesComponen
      }
    ])
  ],
  exports: [RouterModule]
})
export class ExpensesRoutingModule {
}
