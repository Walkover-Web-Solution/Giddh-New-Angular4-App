import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AiOcrService } from '../../services/ai-ocr.service';
import { FILE_ATTACHMENT_TYPE } from '../../app.constant';
import { GeneralActions } from '../../actions/general/general.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
@Component({
    selector: 'ai-ocr-create',
    templateUrl: './ai-ocr-create.component.html',
    styleUrls: ['./ai-ocr-create.component.scss'],
    standalone:false
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
    /** Source of image to be previewed */
    public imagePreviewSource: SafeUrl;

    constructor(
        private domSanitizer: DomSanitizer,
        private generalService: GeneralService,
        private aiOcrService: AiOcrService,
        private store: Store<AppState>,
        private generalActions: GeneralActions
    ) {
    }

    /**
     * Hook cycle for component initialization
     *
     * @memberof AiOcrCreateComponent
     */
    public ngOnInit(): void {
        this.aiOcrService.aiOcrDetails$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.store.dispatch(this.generalActions.openSideMenu(false));
            if (response) {
                const fileExtention = response.fileExtention?.toLowerCase();
                if (FILE_ATTACHMENT_TYPE.IMAGE.includes(fileExtention)) {
                    // Attached file type is image
                    let objectURL = `data:image/${response.fileExtention};base64,` + response.encodedData;
                    this.imagePreviewSource = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
                    this.sanitizedPdfFileUrl = null;
                } else if (FILE_ATTACHMENT_TYPE.PDF.includes(fileExtention)) {
                    // Attached file type is PDF
                    this.selectedVoucher = this.generalService.base64ToBlob(response.encodedData || response, 'application/pdf', 512);
                    const file = new Blob([this.selectedVoucher], { type: 'application/pdf' });
                    URL.revokeObjectURL(this.pdfFileURL);
                    this.pdfFileURL = URL.createObjectURL(file);
                    this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                    this.imagePreviewSource = null;
                }
                this.isFileUploading = false;
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
        this.store.dispatch(this.generalActions.openSideMenu(true));
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
