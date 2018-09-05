import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AppState } from '../../../../store/roots';
import { ReplaySubject } from 'rxjs';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';
import { InvoiceTemplatesService } from '../../../../services/invoice.templates.service';
import { InvoiceUiDataService } from '../../../../services/invoice.ui.data.service';
import { TemplateContentUISectionVisibility } from '../../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../../models/api-models/Invoice';

@Component({
  selector: 'gst-template-c',
  templateUrl: './gst-template-c.component.html',
  styleUrls: ['./gst-template-c.component.css'],
  encapsulation: ViewEncapsulation.Native
})

export class GstTemplateCComponent implements OnInit, OnDestroy {

  @Input() public fieldsAndVisibility: any = null;
  @Input() public isPreviewMode: boolean = false;
  @Input() public showLogo: boolean = true;
  @Input() public showCompanyName: boolean;
  @Input() public companyGSTIN: string;
  @Input() public companyPAN: string;
  @Input() public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
  @Input() public logoSrc: string;
  @Input() public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();

  @Output() public sectionName: EventEmitter<string> = new EventEmitter();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public onClickSection(sectionName: string) {
    if (!this.isPreviewMode) {
      this.sectionName.emit(sectionName);
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
