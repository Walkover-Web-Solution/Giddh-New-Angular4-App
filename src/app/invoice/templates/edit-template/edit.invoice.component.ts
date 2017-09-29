/**
 * Created by kunalsaxena on 6/29/17.
 */

import {
  Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges, Component, ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceActions } from '../../../services/actions/invoice/invoice.actions';
import { ISection, GetInvoiceTemplateDetailsResponse, CustomTemplateResponse } from '../../../models/api-models/Invoice';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap';
import { InvoiceTemplatesService } from '../../../services/invoice.templates.service';
import { InvoiceUiDataService } from '../../../services/invoice.ui.data.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'edit-invoice',
  templateUrl: 'edit.invoice.component.html',
  styleUrls: ['edit-template.component.css']
})

export class EditInvoiceComponent implements OnInit {

  @ViewChild('templateModal') public templateModal: ModalDirective;
  @ViewChild('customTemplateConfirmationModal') public customTemplateConfirmationModal: ModalDirective;
  @ViewChild('invoiceTemplatePreviewModal') public invoiceTemplatePreviewModal: ModalDirective;

  public templateId: string = 'common_template_a';
  public heading: string = 'Walkover Web Solutions';
  public template: GetInvoiceTemplateDetailsResponse[];
  public customCreatedTemplates: CustomTemplateResponse[];
  public isLoadingCustomCreatedTemplates: boolean = false;
  public currentTemplate: any;
  public currentTemplateSections: ISection[];
  public deleteTemplateConfirmationMessage: string;
  public confirmationFlag: string;
  public transactionMode: string = 'create';
  public invoiceTemplateBase64Data: string;

  public selectedTemplateUniqueName: string;
  public templateMeta: any;
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private _toasty: ToasterService, private store: Store<AppState>, private invoiceActions: InvoiceActions, private _invoiceTemplatesService: InvoiceTemplatesService, private _invoiceUiDataService: InvoiceUiDataService) {

    this.store.dispatch(this.invoiceActions.getTemplateState());
    this.store.dispatch(this.invoiceActions.getAllCreatedTemplates());
  }
  public ngOnInit() {

    // Get custom created templates
    this.store.select(c => c.invoiceTemplate).takeUntil(this.destroyed$).subscribe((s) => {
      if (s && s.customCreatedTemplates) {
        this.customCreatedTemplates = _.cloneDeep(s.customCreatedTemplates);
      }
    });
  }

  /**
   * onOpenTemplateModal
   */
  public onOpenTemplateModal() {
    this.transactionMode = 'create';
    this._invoiceUiDataService.reloadCustomTemplate();
    this.templateModal.show();
  }

  /**
   * onCloseTemplateModal
   */
  public onCloseTemplateModal() {
    this.confirmationFlag = 'closeConfirmation';
    this.selectedTemplateUniqueName = null;
    this.deleteTemplateConfirmationMessage = `Are you sure want to close this popup? Your unsaved changes will be discarded`;
    this.customTemplateConfirmationModal.show();
  }

  /**
   * createTemplate
   */
  public createTemplate() {
    let data = _.cloneDeep(this._invoiceUiDataService.customTemplate.getValue());
    if (data.name) {
      data = this.newLineToBR(data);
      this._invoiceTemplatesService.saveTemplates(data).subscribe((res) => {
        if (res.status === 'success') {
          this._toasty.successToast('Template Saved Successfully.');
          this.templateModal.hide();
          this.store.dispatch(this.invoiceActions.getAllCreatedTemplates());
        } else {
          this._toasty.errorToast(res.message, res.code);
        }
      });
    } else {
      this._toasty.errorToast('Please enter template name.');
    }
  }

  /**
   * updateTemplate
   */
  public updateTemplate() {
    let data = _.cloneDeep(this._invoiceUiDataService.customTemplate.getValue());
    if (data.name) {
      data.updatedAt = null;
      data.updatedBy = null;
      data.copyFrom = 'gst_template_a';
      data.sections[0].content[3].label = '';

      data = this.newLineToBR(data);

      this._invoiceTemplatesService.updateTemplate(data.uniqueName, data).subscribe((res) => {
        if (res.status === 'success') {
          this._toasty.successToast('Template Updated Successfully.');
          this.confirmationFlag = null;
          this.selectedTemplateUniqueName = null;
          this.deleteTemplateConfirmationMessage = null;
          this.customTemplateConfirmationModal.hide();
          this.templateModal.hide();
          this.store.dispatch(this.invoiceActions.getAllCreatedTemplates());
        } else {
          this._toasty.errorToast(res.message, res.code);
        }
      });
    } else {
      this._toasty.errorToast('Please enter template name.');
    }
  }

  public newLineToBR(template) {
    template.sections[2].content[5].label = template.sections[2].content[5].label.replace(/(?:\r\n|\r|\n)/g, '<br />');
    template.sections[2].content[6].label = template.sections[2].content[6].label.replace(/(?:\r\n|\r|\n)/g, '<br />');
    template.sections[2].content[10].label = template.sections[2].content[10].label.replace(/(?:\r\n|\r|\n)/g, '<br />');
    return template;
  }

  /**
   * onPreview
   */
  public onPreview(template) {
    this._invoiceUiDataService.setTemplateUniqueName(template.uniqueName, 'preview');
    let data = _.cloneDeep(this._invoiceUiDataService.customTemplate.getValue());
    this.invoiceTemplatePreviewModal.show();
  }

  /**
   * onUpdateTemplate
   */
  public onUpdateTemplate(template) {
    this.transactionMode = 'update';
    this._invoiceUiDataService.setTemplateUniqueName(template.uniqueName, 'update');
    this.templateModal.show();
  }

  /**
   * onSetTemplateAsDefault
   */
  public onSetTemplateAsDefault(template) {
    if (template) {
      let selectedTemplate = _.cloneDeep(template);
      // console.log('the selectedTemplate is :', selectedTemplate);
      this.store.dispatch(this.invoiceActions.setTemplateAsDefault(selectedTemplate.uniqueName));
    }
  }

  /**
   * onDeleteTemplate
   */
  public onDeleteTemplate(template) {
    if (template) {
      this.confirmationFlag = 'deleteConfirmation';
      let selectedTemplate = _.cloneDeep(template);
      this.deleteTemplateConfirmationMessage = `Are you sure want to delete "<b>${selectedTemplate.name}</b>" template?`;
      this.selectedTemplateUniqueName = selectedTemplate.uniqueName;
      this.customTemplateConfirmationModal.show();
    }
  }

  /**
   * onCloseConfirmationModal
   */
  public onCloseConfirmationModal(userResponse: any) {
    console.log('THe user res is :', userResponse);
    if (userResponse.response && userResponse.close === 'deleteConfirmation') {
      this.store.dispatch(this.invoiceActions.deleteTemplate(this.selectedTemplateUniqueName));
    } else if (userResponse.response && userResponse.close === 'closeConfirmation') {
      this._invoiceUiDataService.resetCustomTemplate();
      this.templateModal.hide();
    }
    this.customTemplateConfirmationModal.hide();
  }

  /**
   * onClosePreviewModal
   */
  public onClosePreviewModal() {
    this.invoiceTemplatePreviewModal.hide();
  }
}
