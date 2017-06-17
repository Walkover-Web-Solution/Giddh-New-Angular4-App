import { HomeActions } from './actions/home.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeRoutingModule } from './home.routing.module';
import { HomeComponent } from './home.component';
import { ChildHomeComponent } from './components';
import { TranslateModule } from 'ng2-translate';

console.log('`Home` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    HomeComponent,
    ChildHomeComponent
  ],
  exports: [HomeComponent],
  providers: [HomeActions],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    TranslateModule
  ],
})
export class HomeModule {
}
