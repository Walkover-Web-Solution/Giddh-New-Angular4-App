import { RouterModule, Routes } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { NgModule } from '@angular/core';
import { GstPagesComponent } from './gst-pages/gst-pages.component';

/**
 * Created by kunalsaxena on 9/1/17.
 */

const GST_ROUTES: Routes = [
  {
    path: '',
    canActivate: [NeedsAuthentication],
    component: GstPagesComponent,
    children: [
      { path: '', redirectTo: 'gst', pathMatch: 'full' },
      { path: 'gst', component: GstPagesComponent },
    ]
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(GST_ROUTES),
  ],
  exports: [
    RouterModule,
    FormsModule,
    CommonModule,
  ],
  providers: [Location]
})
export class GstRoutingModule { }
