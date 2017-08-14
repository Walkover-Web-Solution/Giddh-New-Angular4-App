import { PageComponent } from '../page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';
import { TlPlComponent } from './tl-pl.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: TlPlComponent, canActivate: [NeedsAuthentication]
      }
    ])
  ],
  exports: [RouterModule]
})
export class TlPlRoutingModule {
}
