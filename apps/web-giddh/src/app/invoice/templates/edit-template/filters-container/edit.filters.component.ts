import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { InvoiceUiDataService } from 'apps/web-giddh/src/app/services/invoice.ui.data.service';

@Component({
    selector: 'edit-template-filters',
    templateUrl: 'edit.filters.component.html',
    styleUrls: ['edit.filters.component.scss']
})

export class EditFiltersContainersComponent implements OnChanges, AfterViewChecked {
    @Input() public editMode: string;
    @Output() public selectTab: EventEmitter<any> = new EventEmitter();
    public ifDesignSelected: boolean = true;
    public ifContentSelected: boolean = false;

    /**
     * Returns the error count of fields
     *
     * @readonly
     * @type {number} Error count
     * @memberof EditFiltersContainersComponent
     */
    public get errorCount(): number {
        return this.invoiceUiDataService.contentFormErrors ?? 0;
    }

    constructor(
        private invoiceUiDataService: InvoiceUiDataService,
        private cdr: ChangeDetectorRef
    ) {
        this.openTab('design');
    }

    public openTab(tab) {
        if (tab === 'design') {
            this.ifDesignSelected = true;
            this.ifContentSelected = false;
        }

        if (tab === 'content') {
            this.ifDesignSelected = false;
            this.ifContentSelected = true;
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

    /**
     * Used this to solve getting expression change error
     *
     * @memberof EditFiltersContainersComponent
     */
    public ngAfterViewChecked(): void {
        this.cdr.detectChanges();
    }
}
