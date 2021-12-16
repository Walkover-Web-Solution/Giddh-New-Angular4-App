import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { select, Store } from "@ngrx/store";
import { UploaderOptions, UploadInput, UploadOutput } from "ngx-uploader";
import { Observable, ReplaySubject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { LedgerActions } from "../../actions/ledger/ledger.actions";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { Configuration, FILE_ATTACHMENT_TYPE } from "../../app.constant";
import { cloneDeep } from "../../lodash-optimized";
import { LEDGER_API } from "../../services/apiurls/ledger.api";
import { CommonService } from "../../services/common.service";
import { GeneralService } from "../../services/general.service";
import { ToasterService } from "../../services/toaster.service";
import { AppState } from "../../store";
import { saveAs } from 'file-saver';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LedgerService } from "../../services/ledger.service";
import { ConfirmModalComponent } from "../new-confirm-modal/confirm-modal.component";
import { InvoiceSetting } from "../../models/interfaces/invoice.setting.interface";
import { InvoiceActions } from "../../actions/invoice/invoice.actions";
import { InvoiceBulkUpdateService } from "../../services/invoice.bulkupdate.service";
import { BreakpointObserver } from "@angular/cdk/layout";
import { NewConfirmationModalComponent } from "../new-confirmation-modal/confirmation-modal.component";
import { ConfirmationModalButton } from "../../common/confirmation-modal/confirmation-modal.interface";

@Component({
    selector: "attachments",
    templateUrl: "./attachments.component.html",
    styleUrls: ["./attachments.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentsComponent implements OnInit, OnDestroy {
    @Input() public selectedItem: any;
    @Input() public isPettyCash: boolean = false;
    /** fileinput element ref for clear value after remove attachment **/
    @ViewChild('fileInputUpdate', { static: false }) public fileInputElement: ElementRef;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public attachments: any[] = [];
    public previewedFile: any;
    public voucherPdf: any;
    /** Stores the current organization type */
    public currentOrganizationType: string;
    /** Stores the current branches */
    public branches: Array<any>;
    public uploadInput: EventEmitter<UploadInput>;
    public fileUploadOptions: UploaderOptions;
    public isFileUploading: boolean = false;
    /** Holds active company data */
    public activeCompany: any = {};
    /** Holds session key observable */
    public sessionKey$: Observable<string>;
    public allowFilesDownload: boolean = false;
    public invoiceSettings: any;
    public selectAll: boolean = false;
    public isLoading: boolean = true;
    public isMobileView: boolean = false;

    constructor(
        private commonService: CommonService,
        private generalService: GeneralService,
        private domSanitizer: DomSanitizer,
        private toaster: ToasterService,
        private settingsBranchAction: SettingsBranchActions,
        private store: Store<AppState>,
        private ledgerAction: LedgerActions,
        private changeDetectionRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private ledgerService: LedgerService,
        private invoiceAction: InvoiceActions,
        private invoiceBulkUpdateService: InvoiceBulkUpdateService,
        private dialogRef: MatDialogRef<any>,
        private breakpointObserver: BreakpointObserver
    ) {
        this.sessionKey$ = this.store.pipe(select(state => state.session.user.session.id), takeUntil(this.destroyed$));

        this.breakpointObserver.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileView = result.matches;
        });
    }

    public ngOnInit(): void {
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response;
            } else {
                this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
            }
        });

        this.store.pipe(select(state => state.invoice.settings), takeUntil(this.destroyed$)).subscribe((settings: InvoiceSetting) => {
            if (settings) {
                this.invoiceSettings = settings;
            } else {
                this.store.dispatch(this.invoiceAction.getInvoiceSetting());
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        // emit upload event
        this.uploadInput = new EventEmitter<UploadInput>();
        // set file upload options
        this.fileUploadOptions = { concurrency: 0 };

        this.getFiles();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private getFiles(): void {
        let getRequest = {
            voucherType: this.selectedItem.voucherGeneratedType,
            entryUniqueName: (this.selectedItem.voucherUniqueName) ? undefined : this.selectedItem.entryUniqueName,
            uniqueName: (this.selectedItem.voucherUniqueName) ? this.selectedItem.voucherUniqueName : undefined
        };

        this.commonService.downloadFile(getRequest, "ALL").pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.body?.attachments?.length > 0) {
                    this.attachments = response.body?.attachments;

                    this.attachments = this.attachments?.map(attachment => {
                        let fileExtention = attachment?.type?.toLowerCase();
                        let objectURL
                        let fileSource;

                        if (FILE_ATTACHMENT_TYPE.IMAGE.includes(fileExtention)) {
                            objectURL = `data:image/${fileExtention};base64,` + attachment.encodedData;
                            fileSource = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
                            fileExtention = "image";
                        } else if (FILE_ATTACHMENT_TYPE.PDF.includes(fileExtention)) {
                            objectURL = this.generalService.base64ToBlob(attachment.encodedData, 'application/pdf', 512);
                            fileSource = objectURL;
                        } else {
                            objectURL = this.generalService.base64ToBlob(attachment.encodedData, '', 512);
                            fileSource = objectURL;
                            fileExtention = "unsupported";
                        }

                        return { name: attachment.name, uniqueName: attachment.uniqueName, type: fileExtention, src: fileSource, originalSrc: objectURL, encodedData: attachment.encodedData, isChecked: false };
                    });
                }

                if (response.body?.data) {
                    let objectURL = this.generalService.base64ToBlob(response.body?.data, 'application/pdf', 512);
                    this.voucherPdf = { name: this.selectedItem?.voucherNumber, uniqueName: this.selectedItem?.voucherUniqueName, type: "pdf", src: objectURL, originalSrc: objectURL, encodedData: response.body?.data, isChecked: false };
                    if (!this.isMobileView) {
                        this.showVoucherPreview();
                    }
                } else {
                    this.showFilePreview(this.attachments[0]);
                }
                this.isLoading = false;
                this.changeDetectionRef.detectChanges();
            } else {
                this.isLoading = false;
                this.changeDetectionRef.detectChanges();
                this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
            }
        }, (error => {
            this.isLoading = false;
            this.changeDetectionRef.detectChanges();
            this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
        }));
    }

    public showFilePreview(attachment: any): void {
        this.previewedFile = attachment;
        if (!this.isMobileView) {
            if (attachment?.type === "pdf") {
                const file = new Blob([attachment?.src], { type: 'application/pdf' });
                let pdfFileURL = URL.createObjectURL(file);
                this.previewedFile.src = this.domSanitizer.bypassSecurityTrustResourceUrl(pdfFileURL);
            }
            this.changeDetectionRef.detectChanges();
        } else {
            let dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                width: '310px',
                data: {
                    configuration: this.getConfirmationModalConfiguration()
                }
            });

            dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                if (response === "Preview") {
                    if (this.previewedFile?.type === "pdf") {
                        const file = new Blob([this.previewedFile?.src], { type: 'application/pdf' });
                        let pdfFileURL = URL.createObjectURL(file);
                        this.previewedFile.src = pdfFileURL;
                    }
                    this.openPreview();
                } else if (response === "Download") {
                    this.downloadFiles();
                } else if (response === "Print") {

                }
            });
        }
    }

    public showVoucherPreview(): void {
        if (!this.isMobileView) {
            this.previewedFile = cloneDeep(this.voucherPdf);
            const file = new Blob([this.voucherPdf?.src], { type: 'application/pdf' });
            let pdfFileURL = URL.createObjectURL(file);
            this.previewedFile.src = this.domSanitizer.bypassSecurityTrustResourceUrl(pdfFileURL);
            this.changeDetectionRef.detectChanges();
        } else {
            let dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                width: '310px',
                data: {
                    configuration: this.getConfirmationModalConfiguration()
                }
            });

            dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                if (response === "Preview") {
                    const file = new Blob([this.voucherPdf?.src], { type: 'application/pdf' });
                    let pdfFileURL = URL.createObjectURL(file);
                    window.open(pdfFileURL);
                } else if (response === "Download") {
                    saveAs(this.voucherPdf.src, `${this.voucherPdf.name}.pdf`);
                } else if (response === "Print") {

                }
            });
        }
    }

    public openPreview(): void {
        let file = new Image();
        file.src = this.previewedFile.originalSrc;
        let windowObject = window.open("");
        windowObject.document.write(file.outerHTML);
    }

    public onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') {
            let sessionKey = null;
            let companyUniqueName = this.activeCompany?.uniqueName;
            this.sessionKey$.pipe(take(1)).subscribe(key => sessionKey = key);
            const event: UploadInput = {
                type: 'uploadAll',
                url: Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName),
                method: 'POST',
                fieldName: 'file',
                data: { company: companyUniqueName },
                headers: { 'Session-Id': sessionKey },
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'start') {
            this.isFileUploading = true;
        } else if (output.type === 'done') {
            if (output.file.response.status === 'success') {
                this.isFileUploading = false;
                this.selectedItem.attachedFiles = [output.file.response.body?.uniqueName];
                this.toaster.showSnackBar("success", this.localeData?.file_uploaded);

                this.store.dispatch(this.ledgerAction.updateTxnEntry(this.selectedItem, this.selectedItem.particular?.uniqueName, this.selectedItem.entryUniqueName));
            } else {
                this.isFileUploading = false;
                this.selectedItem.attachedFiles = [];
                this.toaster.showSnackBar("error", output.file.response.message);
            }
        }
    }

    public selectAttachment(event: any, attachment: any): void {
        attachment.isChecked = event?.checked;
        this.allowFilesDownload = false;

        let isAttachmentSelected = this.attachments?.filter(attachment => attachment.isChecked);
        if (isAttachmentSelected?.length > 0 || this.voucherPdf?.isChecked) {
            this.allowFilesDownload = true;
        }

        let allAttachmentSelected = this.attachments?.filter(attachment => !attachment.isChecked);
        if (!allAttachmentSelected?.length && this.voucherPdf?.isChecked) {
            this.selectAll = true;
        } else {
            this.selectAll = false;
        }

        this.changeDetectionRef.detectChanges();
    }

    public downloadFiles(): void {
        let isAttachmentSelected = this.attachments?.filter(attachment => attachment.isChecked);
        if (isAttachmentSelected?.length > 0 && this.voucherPdf?.isChecked) {
            let getRequest = {
                typeOfInvoice: ["Original"],
                voucherType: this.selectedItem.voucherGeneratedType,
                entryUniqueName: (this.selectedItem.voucherUniqueName) ? undefined : this.selectedItem.entryUniqueName,
                uniqueName: (this.selectedItem.voucherUniqueName) ? this.selectedItem.voucherUniqueName : undefined
            };

            this.commonService.downloadFile(getRequest, "ALL", "pdf").pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status !== "error") {
                    saveAs(response, `${this.selectedItem.voucherNumber}.` + 'zip');
                } else {
                    this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }
            }, (error => {
                this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
            }));
        } else if (isAttachmentSelected?.length > 0) {
            let src = this.generalService.base64ToBlob(this.attachments[0].encodedData, `image/${this.attachments[0].type}`, 512);
            saveAs(src, `${this.attachments[0].name}`);
        } else if (this.voucherPdf?.isChecked) {
            saveAs(this.voucherPdf.src, `${this.voucherPdf.name}.pdf`);
        }
    }

    public showDeleteAttachedFileModal(index: number): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '630px',
            data: {
                title: this.commonLocaleData?.app_delete,
                body: this.localeData?.confirm_delete_file,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.localeData?.delete_entries_content
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.ledgerService.removeAttachment(this.attachments[index]?.uniqueName).subscribe((response) => {
                    if (response?.status === 'success') {
                        let updatedAttachments = this.attachments.filter(attachment => attachment.uniqueName !== this.attachments[index]?.uniqueName);
                        this.attachments = updatedAttachments;

                        if (this.fileInputElement && this.fileInputElement.nativeElement) {
                            this.fileInputElement.nativeElement.value = '';
                        }
                        this.toaster.showSnackBar("success", this.localeData?.remove_file);

                        this.changeDetectionRef.detectChanges();
                    } else {
                        this.toaster.showSnackBar("error", response?.message)
                    }
                });
            }
        });
    }

    public showDeleteVoucherModal(): void {
        let messageBody = this.localeData?.confirm_delete_file;
        let autoDeleteEntries = this.invoiceSettings?.invoiceSettings?.autoDeleteEntries;
        if (autoDeleteEntries) {
            messageBody = "You enabled to delete entries on voucher delete, so this will delete your entry as well.";
        }

        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '630px',
            data: {
                title: this.commonLocaleData?.app_delete,
                body: messageBody,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.localeData?.delete_entries_content
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                let bulkDeleteModel = {
                    voucherUniqueNames: [this.selectedItem?.voucherUniqueName],
                    voucherType: this.selectedItem?.voucherGeneratedType
                };

                this.invoiceBulkUpdateService.bulkUpdateInvoice(bulkDeleteModel, 'delete').subscribe(response => {
                    if (response) {
                        if (response.status === "success") {
                            this.toaster.showSnackBar("success", response.body);

                            if (autoDeleteEntries) {
                                this.dialogRef.close(true);
                            } else {
                                this.voucherPdf = null;
                                this.changeDetectionRef.detectChanges();
                            }
                        } else {
                            this.toaster.showSnackBar("error", response.message);
                        }
                    }
                });
            }
        });
    }

    public selectAllAttachments(event: any): void {
        this.attachments = this.attachments?.map(attachment => {
            attachment.isChecked = event?.checked;
            return attachment;
        });

        if (this.voucherPdf) {
            this.voucherPdf.isChecked = event?.checked;
        }

        this.allowFilesDownload = event?.checked;
        this.changeDetectionRef.detectChanges();
    }

    private getConfirmationModalConfiguration(): any {
        const buttons: Array<ConfirmationModalButton> = [
            {
                text: 'Preview',
                cssClass: 'btn btn-success'
            },
            {
                text: 'Download',
                cssClass: 'btn btn-success'
            },
            {
                text: 'Print',
                cssClass: 'btn btn-success'
            }
        ];

        const headerText: string = 'Choose';
        const headerCssClass: string = 'd-inline-block mr-1';
        const messageCssClass: string = 'mr-b1 text-light';
        const footerCssClass: string = 'mr-b1';

        return {
            headerText,
            headerCssClass,
            messageText: '',
            messageCssClass,
            footerText: '',
            footerCssClass,
            buttons
        };
    }
}