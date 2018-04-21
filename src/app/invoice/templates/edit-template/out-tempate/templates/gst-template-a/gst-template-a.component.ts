import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';
import * as _ from '../../../../lodash-optimized';
import { InvoiceTemplatesService } from '../../../../services/invoice.templates.service';
import { CustomTemplateResponse } from '../../../../models/api-models/Invoice';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from '../../../../services/invoice.ui.data.service';

// import { IsDivVisible, IsFieldVisible } from '../filters-container/content-filters/content.filters.component';

@Component({
  selector: 'gst-template-a',
  templateUrl: './gst-template-a.component.html',
  styleUrls: ['./gst-template-a.component.css']
})

export class GstTemplateAComponent implements OnInit, OnDestroy {

  @Input() public isPreviewMode: boolean = false;
  @Input() public inputTemplate;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
