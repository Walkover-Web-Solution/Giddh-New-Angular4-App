import { take } from 'rxjs/operators';
import { Component, DoCheck, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { ISection } from '../../../../../models/api-models/Invoice';
import { InvoiceUiDataService } from '../../../../../services/invoice.ui.data.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/roots';
import { EditFiltersContainersComponent } from '../../filters-container/edit.filters.component';

@Component({
    selector: 'invoice-template-modal',
    templateUrl: './template-modal.component.html',
    styleUrls: ['./template-modal.component.css']
})

export class InvoiceTemplateModalComponent implements DoCheck, OnChanges {
    @Input() public templateId: string;
    @Input() public templateSections: ISection;
    @Input() public editMode: string;
    @Output() public downloadOrSendMailEvent: EventEmitter<object> = new EventEmitter();
    @ViewChild(EditFiltersContainersComponent) public editFiltersComponent: EditFiltersContainersComponent;

    public isEmailTabSelected: boolean = false;
    public isPreviewMode: boolean = true;

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

    public ngDoCheck() {
        // let obj = this.invoiceUiDataService.getEmailSettingObj();
        // if (obj)  {
        //   this.emailObject = obj;
        //   this.isEmailTabSelected = obj.isEmailTabSelected;
        // }
    }

    /**
     * ngChanges
     */
    public ngOnChanges(s) {
        if (s.editMode && s.editMode.currentValue !== s.editMode.previousValue) {
            this.editMode = s.editMode.currentValue;
        }
        //
    }

    /**
     * selectedTab
     */
    public selectedTab(ev) {
        if (ev === 'design') {
            this.isPreviewMode = true;
        } else {
            this.isPreviewMode = false;
        }
    }

}
