/**
 * Created by kunalsaxena on 6/29/17.
 */

import {
  Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges, Component
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceActions } from '../../../services/actions/invoice/invoice.actions';
import { ISection, GetInvoiceTemplateDetailsResponse } from '../../../models/api-models/Invoice';
import * as _ from 'lodash';

@Component({
  selector: 'edit-invoice',
  templateUrl: 'edit.invoice.component.html',
  styleUrls: ['edit-template.component.css']
})

export class EditInvoiceComponent implements OnInit {
  public templateId: string = 'common_template_a';
  public heading: string = 'Walkover Web Soluitons';
  public template: GetInvoiceTemplateDetailsResponse[];
  public currentTemplate: any;
  public currentTemplateSections: ISection[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private invoiceActions: InvoiceActions) {

    this.store.dispatch(this.invoiceActions.getTemplateState());

    this.store.select(state => {
      return state.invtemp.templateMeta.templateId;
    }).takeUntil(this.destroyed$).subscribe((value) => {
      if (!_.isEmpty(value)) {
        let copyValue = _ .cloneDeep(value);
        this.templateId = copyValue;
      }
    });

    this.store.select(state => {
      return Object.keys(state.invtemp.template).map(key => state.invtemp.template[key]);
    }).takeUntil(this.destroyed$).take(5).subscribe((value) => {
        if (!_.isEmpty(value)) {
         let copyValue = _ .cloneDeep(value);
         this.template = copyValue;
         let currentTemplate = this.template.find((te) => {
          if (te[this.templateId]) {
            return te[this.templateId];
          }
        });
         this.currentTemplate = _. cloneDeep(currentTemplate);
         this.currentTemplateSections = this.currentTemplate.common_template_a.sections;
         // this.store.dispatch(this.invoiceActions.setTemplateData(this.currentTemplateSections));
        }
    });

  }
  public ngOnInit() {
    // TODO: Fetch current template object and bind to template component
  }

}
