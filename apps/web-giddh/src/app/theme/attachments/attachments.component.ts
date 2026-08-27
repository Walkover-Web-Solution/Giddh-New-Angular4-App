import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { select, Store } from "@ngrx/store";
import { ReplaySubject } from "rxjs";
import { take, takeUntil, finalize } from "rxjs/operators";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { BranchHierarchyType, FILE_ATTACHMENT_TYPE } from "../../app.constant";
import { cloneDeep } from "../../lodash-optimized";
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
import { DscSignDialogService } from "../../services/dsc-sign-dialog.service";
import { DscService } from "../../services/dsc.service";
import printJS from 'print-js';
import { OrganizationType } from "../../models/user-login-state";
import { VoucherTypeEnum } from "../../models/api-models/Sales";
import { ServiceConfig } from "../../services/service.config";

@Component({
    selector: "attachments",
    templateUrl: "./attachments.component.html",
    styleUrls: ["./attachments.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AttachmentsComponent implements OnInit, OnDestroy {
    /** Taking selected entry as input */
    @Input() public selectedItem: any;
    /** Taking input if it's petty cash entry */
    @Input() public isPettyCash: boolean = false;
    /** fileinput element ref for clear value after remove attachment **/
    @ViewChild('fileInputUpdate', { static: false }) public fileInputElement: ElementRef;
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** List of attachments */
    public attachments: any[] = [];
    /** File in preview mode */
    public previewedFile: any;
    /** Holds voucher pdf object */
    public voucherPdf: any;
    /** Stores the current organization type */
    public currentOrganizationType: string;
    /** Holds invoice settings */
    public invoiceSettings: any;
    /** True/false for select all checkbox */
    public selectAll: boolean = false;
    /** True/false if get api call in progress */
    public isLoading: boolean = true;
    /** Holds images folder path */
    public imgPath: string = "";
    /** True if is company */
    public isCompany: boolean = false;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** True while DSC certificates are being preloaded; disables signed-PDF download button. */
    public isDscPreloading: boolean = true;
    /** Holds VoucherType Enum */
    public voucherTypeEnum:any = VoucherTypeEnum;

    constructor(
        private commonService: CommonService,
        private generalService: GeneralService,
        @Inject(ServiceConfig) private serviceConfig,
        private domSanitizer: DomSanitizer,
        private toaster: ToasterService,
        private settingsBranchAction: SettingsBranchActions,
        private store: Store<AppState>,
        private changeDetectionRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private ledgerService: LedgerService,
        private invoiceAction: InvoiceActions,
        private invoiceBulkUpdateService: InvoiceBulkUpdateService,
        private dialogRef: MatDialogRef<AttachmentsComponent>,
        private dscSignDialogService: DscSignDialogService,
        private dscService: DscService
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof AttachmentsComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.imgPath = this.serviceConfig.IMG_PATH;
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response.length > 1;
            } else {
                this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
            }
        });

        this.store.pipe(select(state => state.invoice.settings), takeUntil(this.destroyed$)).subscribe((settings: InvoiceSetting) => {
            if (settings) {
                this.invoiceSettings = settings;
            } else {
                this.store.dispatch(this.invoiceAction.getInvoiceSetting());
            }
        });

        if (!this.previewedFile) {
            if (this.voucherPdf?.type) {
                this.showVoucherPreview();
            } else if (this.attachments?.length > 0) {
                this.showFilePreview(this.attachments[0]);
            }
        }

        this.getFiles();
        document.querySelector('body')?.classList?.add('ledger-attachments-popup');
        
        if (this.shouldShowDownloadSignedPdf(this.selectedItem?.voucherGeneratedType)) {
            this.dscService.preloadCertificates().pipe(
                takeUntil(this.destroyed$),
                finalize(() => {
                    this.isDscPreloading = false;
                    this.changeDetectionRef.detectChanges();
                })
            ).subscribe();
        }
    }

    /** */
    /**
     * True when Download Signed PDF is allowed for the current voucher type.
     *
     * @protected
     * @param {string} voucherType - Voucher type
     * @returns {boolean} True if signed PDF action should be displayed
     * @memberof AttachmentsComponent
     */
    protected shouldShowDownloadSignedPdf(voucherType: string): boolean {
        return voucherType !== VoucherTypeEnum.purchaseOrder && voucherType !== VoucherTypeEnum.estimate && voucherType !== VoucherTypeEnum.proforma && voucherType !== VoucherTypeEnum.receipt && voucherType !== VoucherTypeEnum.payment;
    }

    /**
     * Releases the memory
     *
     * @memberof AttachmentsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body')?.classList?.remove('ledger-attachments-popup');
    }

    /**
     * Get list of files
     *
     * @private
     * @memberof AttachmentsComponent
     */
    private getFiles(): void {
        let getRequest = {
            voucherType: (this.selectedItem.voucherGeneratedType) ? this.selectedItem.voucherGeneratedType : undefined,
            entryUniqueName: this.selectedItem.voucherUniqueName ?? this.selectedItem.entryUniqueName ?? this.selectedItem?.uniqueName,
            uniqueName: (this.selectedItem.voucherUniqueName) ? this.selectedItem.voucherUniqueName : undefined
        };

        this.commonService.downloadFile(getRequest, "ALL").pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (response.body?.attachments?.length > 0) {
                    this.attachments = response.body?.attachments;

                    this.attachments = this.attachments?.map(attachment => {
                        let fileExtention = attachment?.type?.toLowerCase();
                        let objectURL;
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

                        return { name: attachment.name, uniqueName: attachment?.uniqueName, type: fileExtention, src: fileSource, originalSrc: objectURL, encodedData: attachment.encodedData, isChecked: false, originalFileExtension: attachment?.type?.toLowerCase() };
                    });
                }

                if (response.body?.data) {
                    let objectURL = this.generalService.base64ToBlob(response.body?.data, 'application/pdf', 512);
                    this.voucherPdf = { name: this.selectedItem?.voucherNumber, uniqueName: this.selectedItem?.voucherUniqueName, type: "pdf", src: objectURL, originalSrc: objectURL, encodedData: response.body?.data, isChecked: false, originalFileExtension: "pdf" };
                    if (!this.selectedItem?.isAttachment || !this.attachments?.length) {
                        this.showVoucherPreview();
                    } else {
                        this.showFilePreview(this.attachments[0]);
                    }
                } else {
                    this.showFilePreview(this.attachments[0]);
                }
                this.isLoading = false;
                this.changeDetectionRef.detectChanges();
            } else {
                this.isLoading = false;
                this.changeDetectionRef.detectChanges();
                this.toaster.errorToast(response?.message ?? this.commonLocaleData?.app_something_went_wrong);
            }
        }, (error => {
            this.isLoading = false;
            this.changeDetectionRef.detectChanges();
            this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
        }));
    }

    /**
     * Shows attachment preview
     *
     * @param {*} attachment
     * @memberof AttachmentsComponent
     */
    public showFilePreview(attachment: any): void {
        this.previewedFile = cloneDeep(attachment);
        if (attachment?.type === "pdf") {
            const file = new Blob([attachment?.src], { type: 'application/pdf' });
            let pdfFileURL = URL.createObjectURL(file);
            this.previewedFile.src = this.domSanitizer.bypassSecurityTrustResourceUrl(pdfFileURL);
        }
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Shows voucher pdf preview
     *
     * @memberof AttachmentsComponent
     */
    public showVoucherPreview(): void {
        this.previewedFile = cloneDeep(this.voucherPdf);
        const file = new Blob([this.voucherPdf?.src], { type: 'application/pdf' });
        let pdfFileURL = URL.createObjectURL(file);
        this.previewedFile.src = this.domSanitizer.bypassSecurityTrustResourceUrl(pdfFileURL);
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Opens preview in new tab
     *
     * @memberof AttachmentsComponent
     */
    public openPreview(): void {
        let file = new Image();
        file.src = this.previewedFile.originalSrc;
        let windowObject = window.open("");
        if (windowObject?.document) {
            windowObject.document.write(file.outerHTML);
        }
    }

    /**
     * Selects attachment
     *
     * @param {*} event
     * @param {*} attachment
     * @memberof AttachmentsComponent
     */
    public selectAttachment(event: any, attachment: any): void {
        attachment.isChecked = event?.checked;

        let allAttachmentSelected = this.attachments?.filter(attachment => !attachment.isChecked);
        if ((!this.attachments?.length || (this.attachments?.length && !allAttachmentSelected?.length)) && (!this.voucherPdf?.type || this.voucherPdf?.isChecked)) {
            this.selectAll = true;
        } else {
            this.selectAll = false;
        }

        this.changeDetectionRef.detectChanges();
    }

    /**
     * Closes attachment dialog
     *
     * @memberof AttachmentsComponent
     */
    public closeAttachmentDialog(): void {
        this.dialogRef?.close(true);
    }

    /**
     * Downloads the digitally signed invoice PDF for the selected voucher.
     *
     * @memberof AttachmentsComponent
     */
    public downloadSignedInvoicePdf(): void {
        if (!this.selectedItem) {
            return;
        }
        this.dscSignDialogService.openDownloadSignedInvoiceDialog({
            voucher: {...this.selectedItem, uniqueName: this.selectedItem.voucherUniqueName},
            voucherType: this.selectedItem.voucherGeneratedType
        });
    }

    /**
     * Files bulk download
     *
     * @memberof AttachmentsComponent
     */
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
            let src = this.generalService.base64ToBlob(this.attachments[0].encodedData, this.attachments[0].type, 512);
            saveAs(src, `${this.attachments[0].name}`);
        } else if (this.voucherPdf?.isChecked) {
            saveAs(this.voucherPdf.src, `${this.voucherPdf.name}.pdf`);
        } else if (this.previewedFile?.type) {
            let src = this.generalService.base64ToBlob(this.previewedFile.encodedData, this.previewedFile.originalFileExtension, 512);
            saveAs(src, `${this.previewedFile.name}.${this.previewedFile.originalFileExtension}`);
        } else {
            this.toaster.showSnackBar("error", this.localeData?.download_unavailable);
            return;
        }
    }

    /**
     * Shows delete attachment modal
     *
     * @param {number} index
     * @memberof AttachmentsComponent
     */
    public showDeleteAttachedFileModal(index: number): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '40%',
                    data: {
                title: this.commonLocaleData?.app_delete,
                    body: this.localeData?.confirm_delete_file,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.ledgerService.removeAttachment(this.attachments[index]?.uniqueName).subscribe((response) => {
                    if (response?.status === 'success') {
                        let updatedAttachments = this.attachments?.filter(attachment => attachment?.uniqueName !== this.attachments[index]?.uniqueName);
                        this.attachments = updatedAttachments;

                        if (this.fileInputElement && this.fileInputElement.nativeElement) {
                            this.fileInputElement.nativeElement.value = '';
                        }
                        this.toaster.showSnackBar("success", this.localeData?.remove_file);
                        this.changeDetectionRef.detectChanges();

                        this.previewFileAfterDelete();
                    } else {
                        this.toaster.showSnackBar("error", response?.message)
                    }
                });
            }
        });
    }

    /**
     * Shows delete voucher modal
     *
     * @memberof AttachmentsComponent
     */
    public showDeleteVoucherModal(): void {
        let messageBody = this.localeData?.confirm_delete_voucher;
        let autoDeleteEntries = (this.selectedItem?.voucherGenerated && this.selectedItem?.voucherGeneratedType === VoucherTypeEnum.sales) ? this.invoiceSettings?.invoiceSettings?.autoDeleteEntries : false;
        if (autoDeleteEntries) {
            messageBody = this.localeData?.entries_delete_message;
        }

        let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '40%',
                    data: {
                title: this.commonLocaleData?.app_delete,
                    body: messageBody,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no,
                    permanentlyDeleteMessage: this.localeData?.delete_entries_content
                }
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                let bulkDeleteModel = {
                    voucherUniqueNames: [this.selectedItem?.voucherUniqueName],
                    voucherType: this.selectedItem?.voucherGeneratedType
                };

                this.invoiceBulkUpdateService.bulkUpdateInvoice(bulkDeleteModel, 'delete').subscribe(response => {
                    if (response) {
                        if (response.status === "success") {
                            this.toaster.showSnackBar("success", response.body);
                            this.voucherPdf = null;
                            this.changeDetectionRef.detectChanges();
                            this.previewFileAfterDelete();
                            this.closeAttachmentDialog();

                        } else {
                            this.toaster.showSnackBar("error", response.message);
                        }
                    }
                });
            }
        });
    }

    /**
     * Selects all attachments/voucher
     *
     * @param {*} event
     * @memberof AttachmentsComponent
     */
    public selectAllAttachments(event: any): void {
        this.attachments = this.attachments?.map(attachment => {
            attachment.isChecked = event?.checked;
            return attachment;
        });

        if (this.voucherPdf) {
            this.voucherPdf.isChecked = event?.checked;
        }

        this.changeDetectionRef.detectChanges();
    }

    /**
     * Print files
     *
     * @returns {void}
     * @memberof AttachmentsComponent
     */
    public printFiles(): void {
        let isAttachmentSelected = this.attachments?.filter(attachment => attachment.isChecked && attachment.type !== "unsupported");

        if (!isAttachmentSelected?.length && !this.voucherPdf?.isChecked && (!this.previewedFile || this.previewedFile?.type === "unsupported")) {
            this.toaster.showSnackBar("error", this.localeData?.print_unavailable);
            return;
        }

        let filesToPrint = [];

        if (this.voucherPdf?.isChecked) {
            filesToPrint.push({ file: this.voucherPdf?.encodedData, type: "pdf" });
        }

        if (isAttachmentSelected?.length > 0) {
            (Array.isArray(isAttachmentSelected) ? isAttachmentSelected : []).forEach(attachment => {
                if (attachment?.type !== "unsupported") {
                    if (attachment?.type === "image") {
                        filesToPrint.push({ file: `data:image/${attachment?.type};base64,` + attachment?.encodedData, type: attachment?.type });
                    } else {
                        filesToPrint.push({ file: attachment?.encodedData, type: attachment?.type });
                    }
                }
            });
        }

        if (!isAttachmentSelected?.length && !this.voucherPdf?.isChecked && this.previewedFile?.type !== "unsupported") {
            if (this.previewedFile?.type === "image") {
                filesToPrint.push({ file: `data:image/${this.previewedFile?.type};base64,` + this.previewedFile?.encodedData, type: this.previewedFile?.type });
            } else {
                filesToPrint.push({ file: this.previewedFile?.encodedData, type: this.previewedFile?.type });
            }
        }

        if (filesToPrint?.length > 0) {
            this.processPrintQueue(filesToPrint, 0);
        }
    }

    /**
     * Processes the print queue
     *
     * @private
     * @param {*} files
     * @param {number} index
     * @memberof AttachmentsComponent
     */
    private processPrintQueue(files: any, index: number): void {
        printJS({
            printable: files[index]?.file, type: files[index]?.type, base64: true, documentTitle: "",
            onPrintDialogClose: () => {
                setTimeout(() => {
                    if (files[index + 1]) {
                        this.processPrintQueue(files, index + 1);
                    }
                }, 100);
            },
            onError: (error) => {
                this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong);
            }
        });
    }

    /**
     * Shows preview of another available file after delete, else closes the modal
     *
     * @private
     * @memberof AttachmentsComponent
     */
    private previewFileAfterDelete(): void {
        if (this.voucherPdf) {
            this.showVoucherPreview();
        } else {
            if (this.attachments?.length > 0) {
                this.showFilePreview(this.attachments[0]);
            } else {
                this.closeAttachmentDialog();
            }
        }
    }
}
