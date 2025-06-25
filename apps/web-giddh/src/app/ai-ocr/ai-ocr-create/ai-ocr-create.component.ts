import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AiOcrService } from '../../services/ai-ocr.service';
@Component({
    selector: 'ai-ocr-create',
    templateUrl: './ai-ocr-create.component.html',
    styleUrls: ['./ai-ocr-create.component.scss']
})

export class AiOcrCreateComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: SafeUrl = null;
    /** Whether file is uploading */
    public isFileUploading: boolean = true;
    /** Holds PDF file value */
    public pdfFileURL: string = '';
    /** Holds Current selected invoice */
    public selectedVoucher: any;

    constructor(
        private domSanitizer: DomSanitizer,
        private generalService: GeneralService,
        private aiOcrService: AiOcrService
    ) {}

    /**
     * Hook cycle for component initialization
     *
     * @memberof AiOcrCreateComponent
     */
    public ngOnInit(): void {
        this.aiOcrService.aiOcrDetails$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.selectedVoucher = this.generalService.base64ToBlob(response.encodedData || response, 'application/pdf', 512);
                const file = new Blob([this.selectedVoucher], { type: 'application/pdf' });
                URL.revokeObjectURL(this.pdfFileURL);
                this.pdfFileURL = URL.createObjectURL(file);
                this.isFileUploading = false;
                this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
            } else {
                this.isFileUploading = false;
            }
        });
    }

    /**
     * This will call on component destroy
     *
     * @memberof AiOcrCreateComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
