import { PageComponent } from '../page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';
import { SearchComponent } from './search.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'search', redirectTo: 'pages/search', pathMatch: 'full', canActivate: [NeedsAuthentication] },
      {
        path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
        children: [
          {
            path: 'search', component: SearchComponent, canActivate: [NeedsAuthentication]
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
