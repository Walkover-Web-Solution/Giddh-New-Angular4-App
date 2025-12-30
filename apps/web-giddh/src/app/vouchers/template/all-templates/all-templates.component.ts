import { debounceTime, takeUntil } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { cloneDeep } from '../../../lodash-optimized';
import { CustomTemplateResponse } from '../../../models/api-models/Invoice';
import { InvoiceUiDataService } from '../../../services/invoice.ui.data.service';
import { InvoiceTemplatesService } from '../../../services/invoice.templates.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IFRAME_ZOOM_CONFIG } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
    selector: 'all-templates',
    templateUrl: './all-templates.component.html',
    styleUrls: ['./all-templates.component.scss'],
    standalone: false
})
export class AllTemplatesComponent implements OnInit {
    /** Input template */
    public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    /** Destroyed$ subject */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: SafeUrl = null;
    /** Whether file is uploading */
    public isFileUploading: boolean = true;
    /** Holds PDF file value */
    public pdfFileURL: string = '';
    constructor(
        private invoiceUiDataService: InvoiceUiDataService,
        private generalService: GeneralService,
        private domSanitizer: DomSanitizer,
        private invoiceTemplatesService: InvoiceTemplatesService,
        private toasty: ToasterService) {
    }

    /**
     * Angular lifecycle hook that is called after data-bound properties are initialized.
     * Initializes company, template, and UI data for the template editor.
     *
     * @memberof AllTemplatesComponent
     */
    public ngOnInit(): void {
        this.invoiceUiDataService.customTemplate.pipe(debounceTime(1500), takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
            if (template?.uniqueName) {
                this.inputTemplate = cloneDeep(template);
                this.invoiceTemplatesService.saveTemplateSettings(this.inputTemplate).subscribe((response) => {
                    if (response && response?.status === 'success') {
                        const setting = this.generalService.base64ToBlob(response?.body?.data || response, 'application/pdf', 512);
                        const file = new Blob([setting], { type: 'application/pdf' });
                        URL.revokeObjectURL(this.pdfFileURL);
                        this.pdfFileURL = URL.createObjectURL(file);
                        // Use fit entire page configuration from constants
                        const pdfUrlWithZoom = `${this.pdfFileURL}${IFRAME_ZOOM_CONFIG.ZOOM_100}`;
                        this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(pdfUrlWithZoom);
                        this.isFileUploading = false;
                    } else {
                        this.isFileUploading = false;
                        this.toasty.errorToast(response?.message, response?.code);
                    }
                });
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
