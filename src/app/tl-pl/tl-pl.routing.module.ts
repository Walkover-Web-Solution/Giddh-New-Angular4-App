import { PageComponent } from '../page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';
import { TlPlComponent } from './tl-pl.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'trial-balance-and-profit-loss',
        redirectTo: 'pages/trial-balance-and-profit-loss',
        pathMatch: 'full',
        canActivate: [NeedsAuthentication]
      },
      {
        path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
        children: [
          {
            path: 'trial-balance-and-profit-loss', component: TlPlComponent, canActivate: [NeedsAuthentication]
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class TlPlRoutingModule {
}
