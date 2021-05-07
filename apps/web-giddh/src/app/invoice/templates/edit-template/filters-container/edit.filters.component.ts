import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { InvoiceUiDataService } from 'apps/web-giddh/src/app/services/invoice.ui.data.service';

@Component({
    selector: 'edit-template-filters',
    templateUrl: 'edit.filters.component.html',
    styleUrls: ['edit.filters.component.scss']
})

export class EditFiltersContainersComponent implements OnChanges {
    @Input() public editMode: string;
    @Output() public selectTab: EventEmitter<any> = new EventEmitter();
    public ifDesignSelected: boolean = true;
    public ifContentSelected: boolean = false;
    public ifEmailSelected: boolean = false;

    /**
     * Returns the error count of fields
     *
     * @readonly
     * @type {number} Error count
     * @memberof EditFiltersContainersComponent
     */
    public get errorCount(): number {
        return this.invoiceUiDataService.contentFormErrors;
    }

    constructor(
        private invoiceUiDataService: InvoiceUiDataService
    ) {
        this.openTab('design');
    }

    public openTab(tab) {
        if (tab === 'design') {
            this.ifDesignSelected = true;
            this.ifContentSelected = false;
            this.ifEmailSelected = false;
        }

        if (tab === 'content') {
            this.ifDesignSelected = false;
            this.ifContentSelected = true;
            this.ifEmailSelected = false;
        }

        if (tab === 'email') {
            this.ifDesignSelected = false;
            this.ifContentSelected = false;
            this.ifEmailSelected = true;
        }
        this.selectTab.emit(tab);
    }

    /**
     * ngOnChanges
     */
    public ngOnChanges(s) {
        if (s.editMode && s.editMode.currentValue !== s.editMode.previousValue) {
            this.editMode = s.editMode.currentValue;
        }
    }
}
