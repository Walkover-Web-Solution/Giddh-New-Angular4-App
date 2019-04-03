import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyResponse } from 'app/models/api-models/Company';
import { CompanyActions } from 'app/actions/company.actions';
import { ReplaySubject, Observable, of } from 'rxjs';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import * as  moment from 'moment/moment';
import { InvoicePurchaseActions } from 'app/actions/purchase-invoice/purchase-invoice.action';
import { ToasterService } from 'app/services/toaster.service';
import { TabsetComponent } from 'ngx-bootstrap';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'gstErrorSheet',
  templateUrl: 'gstErrorSheet.component.html',
  styleUrls: ['gstErrorSheet.component.css'],
})


export class gstErrorSheetComponent {

}