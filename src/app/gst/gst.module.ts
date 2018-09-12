import { GstPageCComponent } from './gst-page-c/gst-page-c.component';
import { GstPagesComponent } from './gst-pages/gst-pages.component';
import { GstComponent } from './gst.component';
import { GstRoutingModule } from './gst.routing.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgModule } from '@angular/core';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { LaddaModule } from 'angular2-ladda';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { GstPageBComponent } from './gst-page-b/gst-page-b.component';

/**
 * Created by kunalsaxena on 9/1/17.
 */

@NgModule({
  declarations: [GstPagesComponent, GstPageBComponent, GstPageCComponent, GstComponent],
  imports: [
    GstRoutingModule,
    CollapseModule,
    PaginationModule,
    DatepickerModule,
    BsDropdownModule,
    Daterangepicker,
    LaddaModule,
    HighlightModule,
    TooltipModule,
    ClickOutsideModule
  ]
})
export class GstModule { }
