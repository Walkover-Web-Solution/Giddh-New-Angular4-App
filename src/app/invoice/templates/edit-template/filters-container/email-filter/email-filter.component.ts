import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { InvoiceUiDataService } from '../../../../../services/invoice.ui.data.service';
import { EmailSettingObjDefinition } from '../../../../../models/interfaces/invoice.setting.interface';

@Component({
  selector: 'invoice-email-filter-component',
  templateUrl: './email-filter.component.html'
})

export class InvoiceEmailFilterComponent implements OnInit, OnDestroy {

  public emailObject: EmailSettingObjDefinition = new EmailSettingObjDefinition();

  constructor(private invoiceUiDataService: InvoiceUiDataService) { }

  public ngOnInit() {
    // let emailObj = _.cloneDeep(this.emailObject);
    // emailObj.isEmailTabSelected = true;
    // this.invoiceUiDataService.updateEmailSettingObj(emailObj);
  }

  /**
  * onUpdateEmailObject
  */
  public onUpdateEmailObject() {
    // let emailObj = _.cloneDeep(this.emailObject);
    // emailObj.isEmailTabSelected = true;
    // this.invoiceUiDataService.updateEmailSettingObj(emailObj);
  }

  public ngOnDestroy() {
    // let emailObj = _.cloneDeep(this.emailObject);
    // emailObj.isEmailTabSelected = false;
    // this.invoiceUiDataService.updateEmailSettingObj(emailObj);
  }

}
