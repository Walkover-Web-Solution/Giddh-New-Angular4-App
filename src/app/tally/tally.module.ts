import { NgModule } from '@angular/core';
import { TallyComponent } from './tally.component';
import { TallyRoutingModule } from './tally.routing.module';
import { CurrentComponent } from './Components/Current/current.component';

@NgModule({
  declarations: [
    TallyComponent,
    CurrentComponent
  ],
  imports: [
    TallyRoutingModule
  ],
  exports: [
  ],
  entryComponents: [],
  providers: []
})

export class TallyModule {
}
