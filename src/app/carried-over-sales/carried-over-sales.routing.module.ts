import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarriedOverSalesComponent } from './carried-over-sales.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '', component: CarriedOverSalesComponent, canActivate: [NeedsAuthentication]
    }])
  ],
  exports: [RouterModule]
})

export class CarriedOverSalesRoutingModule {
}
