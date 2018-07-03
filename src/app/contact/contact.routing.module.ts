import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { ContactComponent } from './contact.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: ContactComponent, canActivate: [NeedsAuthentication],
      }
    ])
  ],
  exports: [RouterModule]
})
export class ContactRoutingModule {
}
