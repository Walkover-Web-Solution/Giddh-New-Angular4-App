import { GstComponent } from './gst.component';
import { GstRoutingModule } from './gst.routing.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgModule } from '@angular/core';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule, PaginationComponent } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { LaddaModule } from 'angular2-ladda';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { FileGstR3Component } from './gstR3/gstR3.component';
import { FileGstR2Component } from './gstR2/gstR2.component';
import { FileGstR1Component } from './gstR1/gstR1.component';
import { FilingComponent } from './filing/filing.component';
import { FilingHeaderComponent } from './filing/header/header.component';
import { FilingOverviewComponent } from './filing/tabs/overview/overview.component';
import { ReconcileComponent } from './filing/tabs/reconcilation/reconcilation.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PushToGstInComponent } from './filing/tabs/push-to-gstin/push-to-gstin.component';
import { ElementViewChildModule } from 'app/shared/helpers/directives/elementViewChild/elementViewChild.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { DecimalDigitsModule } from 'app/shared/helpers/directives/decimalDigits/decimalDigits.module';
import { PurchaseModule } from 'app/purchase/purchase.module';

/**
 * Created by kunalsaxena on 9/1/17.
 */

@NgModule({
  declarations: [FileGstR1Component, FileGstR2Component, FileGstR3Component, GstComponent, FilingComponent, FilingHeaderComponent, FilingOverviewComponent, ReconcileComponent, PushToGstInComponent],
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
    ClickOutsideModule,
    TabsModule,
    ElementViewChildModule,
    AlertModule,
    DecimalDigitsModule,
    PurchaseModule
  ],
  providers: [Location],
  entryComponents: [
    PaginationComponent
  ]
})
export class GstModule { }
