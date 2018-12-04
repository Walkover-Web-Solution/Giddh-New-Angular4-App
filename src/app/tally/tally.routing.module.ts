import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { TallyComponent } from './tally.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: TallyComponent, canActivate: [NeedsAuthentication],
        children: [
          {path: 'imports', component: TallyComponent, canActivate: [NeedsAuthentication]},
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class TallyRoutingModule {
}
