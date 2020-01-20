import { take } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InvoiceUiDataService } from '../../../../../services/invoice.ui.data.service';
import { EmailSettingObjDefinition } from '../../../../../models/interfaces/invoice.setting.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store';

@Component({
    selector: 'invoice-email-filter-component',
    templateUrl: './email-filter.component.html'
})

export class InvoiceEmailFilterComponent implements OnInit, OnDestroy {

    public emailObject: EmailSettingObjDefinition = new EmailSettingObjDefinition();

    constructor(private invoiceUiDataService: InvoiceUiDataService, private store: Store<AppState>) {
        let companyUniqueName = null;
        let companies = null;
        let defaultTemplate = null;

        this.store.select(s => s.session).pipe(take(1)).subscribe(ss => {
            companyUniqueName = ss.companyUniqueName;
            companies = ss.companies;
        });

        this.store.select(s => s.invoiceTemplate).pipe(take(1)).subscribe(ss => {
            defaultTemplate = ss.defaultTemplate;
        });
        this.invoiceUiDataService.initCustomTemplate(companyUniqueName, companies, defaultTemplate);
    }

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
