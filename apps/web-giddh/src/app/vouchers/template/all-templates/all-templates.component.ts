import { takeUntil } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { CustomTemplateResponse } from '../../../models/api-models/Invoice';
import { InvoiceUiDataService } from '../../../services/invoice.ui.data.service';

@Component({
    selector: 'all-templates',
    templateUrl: './all-templates.component.html',
    styleUrls: ['./all-templates.component.scss']
})
export class AllTemplatesComponent implements OnInit {
    /** Input template */
    public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    /** Destroyed$ subject */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private invoiceUiDataService: InvoiceUiDataService) {
    }

    /**
     * Angular lifecycle hook that is called after data-bound properties are initialized.
     * Initializes company, template, and UI data for the template editor.
     *
     * @memberof AllTemplatesComponent
     */
    public ngOnInit(): void {
        this.invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
            if (template && template.uniqueName) {
                this.inputTemplate = cloneDeep(template);
            }
        });
    }

    /**
     * Angular lifecycle hook that is called when the component is destroyed.
     * Cleans up subscriptions and resources.
     *
     * @memberof AllTemplatesComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}