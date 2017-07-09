import { PageComponent } from '../page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';
import { AuditLogsGridComponent } from './components/audit-logs-grid/audit-logs-grid.component';
import { AuditLogsComponent } from './audit-logs.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'audit-logs', redirectTo: 'pages/audit-logs', pathMatch: 'full', canActivate: [NeedsAuthentication] },
      {
        path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
        children: [
          {
            path: 'audit-logs', component: AuditLogsComponent, canActivate: [NeedsAuthentication]
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AuditLogsRoutingModule { }
