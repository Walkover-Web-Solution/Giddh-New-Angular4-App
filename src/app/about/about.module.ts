import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutRoutingModule } from './about.routing.module';
import { AboutComponent } from './about.component';

console.log('`About` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    AboutComponent,
  ],
  exports: [AboutComponent],
  imports: [
    CommonModule,
    FormsModule,
    AboutRoutingModule
  ],
})
export class AboutModule {
}
