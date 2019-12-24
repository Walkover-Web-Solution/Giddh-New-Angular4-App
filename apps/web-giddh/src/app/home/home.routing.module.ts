import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { TotalSalesComponent } from './components/total-sales/total-sales.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: HomeComponent },
            { path: 'total-sales', component: TotalSalesComponent }
        ])
    ],

    exports: [RouterModule]


})
export class HomeRoutingModule {
}
