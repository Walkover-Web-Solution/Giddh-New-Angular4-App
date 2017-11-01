import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { ISection } from '../../../../../models/api-models/Invoice';
import { InvoiceUiDataService } from '../../../../../services/invoice.ui.data.service';
import { EmailSettingObjDefinition } from '../../../../../models/interfaces/invoice.setting.interface';

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
  public emailObject: EmailSettingObjDefinition;

  constructor(private invoiceUiDataService: InvoiceUiDataService) {
  }

  public ngDoCheck() {
    // let obj = this.invoiceUiDataService.getEmailSettingObj();
    // if (obj)  {
    //   this.emailObject = obj;
    //   this.isEmailTabSelected = obj.isEmailTabSelected;
    // }
  }

}
