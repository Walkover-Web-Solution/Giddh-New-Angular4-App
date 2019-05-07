import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { AgingReportComponent } from './aging-report.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: AgingReportComponent, canActivate: [NeedsAuthentication],
      }
    ])
  ],
  exports: [RouterModule]
})
export class AgingReportRoutingModule {
}
