import { GstPageCComponent } from './gst-page-c/gst-page-c.component';
import { RouterModule, Routes } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { NgModule } from '@angular/core';
import { GstPagesComponent } from './gst-pages/gst-pages.component';
import { GstPageBComponent } from './gst-page-b/gst-page-b.component';
import { GstComponent } from './gst.component';

/**
 * Created by kunalsaxena on 9/1/17.
 */

const GST_ROUTES: Routes = [
  { path: '', component: GstComponent },
  { path: 'gst', component: GstPagesComponent },
  { path: 'gst-page-b', component: GstPageBComponent },
  { path: 'gst-page-c', component: GstPageCComponent }
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
