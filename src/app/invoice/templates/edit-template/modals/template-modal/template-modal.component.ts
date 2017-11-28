import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { ISection } from '../../../../../models/api-models/Invoice';
import { InvoiceUiDataService } from '../../../../../services/invoice.ui.data.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/roots';

@Component({
  selector: 'invoice-template-modal',
  templateUrl: './template-modal.component.html',
  styleUrls: ['./template-modal.component.css']
})

export class InvoiceTemplateModalComponent implements DoCheck {
  @Input() public templateId: string;
  @Input() public templateSections: ISection[];
  @Output() public downloadOrSendMailEvent: EventEmitter<object> = new EventEmitter();

  public isEmailTabSelected: boolean = false;

  constructor(private invoiceUiDataService: InvoiceUiDataService, private store: Store<AppState>) {
    let companyUniqueName = null;
    let companies = null;
    let defaultTemplate = null;

    this.store.select(s => s.session).take(1).subscribe(ss => {
      companyUniqueName = ss.companyUniqueName;
      companies = ss.companies;
    });

    this.store.select(s => s.invoiceTemplate).take(1).subscribe(ss => {
      defaultTemplate = ss.defaultTemplate;
    });
    this.invoiceUiDataService.initCustomTemplate(companyUniqueName, companies, defaultTemplate);
  }

  public ngDoCheck() {
    // let obj = this.invoiceUiDataService.getEmailSettingObj();
    // if (obj)  {
    //   this.emailObject = obj;
    //   this.isEmailTabSelected = obj.isEmailTabSelected;
    // }
  }

}
