import { Component, Inject, OnDestroy, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, Observable, ReplaySubject, takeUntil, tap, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SalesPersonComponentStore } from './utility/sales-person.store';
import { SalesPersonService } from './utility/sales-person.service';
import { KeyboardShortutModule } from '../helpers/directives/keyboardShortcut/keyboardShortut.module';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { GiddhPageLoaderModule } from '../giddh-page-loader/giddh-page-loader.module';
import { ElementViewChildModule } from '../helpers/directives/elementViewChild/elementViewChild.module';
import { MatTableModule } from '@angular/material/table';
import { ActionTypeEnum, SalesPersonActionEnum, SalesPersonArchiveEnum, SalesPersonCreateUpdate, SalesPersonErrorDetailsEnum } from './utility/sales-person.constant';
import { InputFieldComponent } from '../../theme/form-fields/input-field/input-field.component';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';
import { GeneralService } from '../../services/general.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../app.constant';
import { MatMenuModule } from '@angular/material/menu';
import { ArchiveSalesPersonComponent } from './archive/archive.component';
import { includes, set } from '../../lodash-optimized';
// import { MobileNumberInputComponent } from '../mobile-number-input';

@Component({
    selector: 'app-sales-person',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormFieldsModule,
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        MatExpansionModule,
        MatPaginatorModule,
        KeyboardShortutModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        ElementViewChildModule,
        MatMenuModule
        // MobileNumberInputComponent
    ],
    templateUrl: './sales-person.component.html',
    styleUrls: ['./sales-person.component.scss'],
    providers: [SalesPersonService, SalesPersonComponentStore],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SalesPersonComponent implements OnInit, OnDestroy {
    /** ViewChild reference for name field */
    @ViewChild('nameField') nameField: InputFieldComponent;
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold locale JSON data */
    public localeData: any = {};
    /** Form submission flag */
    public isFormSubmitted: boolean = false;
    /** Sales Person List is modified */
    public salesPersonListIsModified: boolean = false;
    /** Holds transfer info if active sales person is transfer */
    public activeSalePersonIsTransfer: any;
    /** True to open mat-expansion-panel */
    public openMatExpansionPanel: boolean = true;
    /** Create form group of Name, Email and Mobile Number */
    public salesPersonForm: FormGroup;
    /** Sales Person Store */
    public salesPersonList$: Observable<any> = this.componentStore.salesPersonList$;
    /** Sales Person Save In Progress */
    public salesPersonSaveInProgress$: Observable<boolean> = this.componentStore.salesPersonSaveInProgress$;
    /** Create/Update Sales Person Success */
    public createUpdateSalesPersonSuccess$: Observable<boolean> = this.componentStore.createUpdateSalesPersonSuccess$;
    /** Delete Sales Person Success */
    public deleteSalesPersonSuccess$: Observable<boolean> = this.componentStore.deleteSalesPersonSuccess$;
    /** Sales Person List In Progress */
    public salesPersonListInProgress$: Observable<boolean> = this.componentStore.salesPersonListInProgress$;
    /** Displayed columns for sales person table */
    public displayedColumns: string[] = ['name', 'email', 'mobileNumber', 'archiveStatus', 'action'];
    /** Active Row Index */
    public activeRowIndex: number = -1;
    /** Sales Person Action Enum */
    public readonly salesPersonActionEnum = SalesPersonActionEnum;
    /** Sales Person Archive Enum */
    public readonly salesPersonArchiveEnum = SalesPersonArchiveEnum;
    /** Sales Person Unique Name in case of user edit or delete */
    public salesPersonUniqueName: string | null = null;
    /** True if edit mode */
    public isEditMode: boolean = false;
    /** Sales Person Details in case of user edit */
    public currentSalesPerson: SalesPersonCreateUpdate | null = null;
    /** Holds page Size Options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Holds advance Filters keys */
    public requestParams: any = {
        page: 1,
        count: PAGINATION_LIMIT,
        archive: SalesPersonArchiveEnum.BOTH
    };
    /** Total results */
    public totalResults: number = 0;
    /** Transfer and delete dialog reference */
    public transferAndDeleteDialogRef: MatDialogRef<any>;
    /** Transfer and archive dialog reference */
    public transferAndArchiveDialogRef: MatDialogRef<any>;
    /** Voucher API Version */
    public voucherApiVersion: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public salesPersonData: any,
        public dialogRef: MatDialogRef<any>,
        private componentStore: SalesPersonComponentStore,
        private generalService: GeneralService,
        private dialog: MatDialog
    ) { }

    /**
     * Lifecycle hook runs on component initialization
     *
     * @memberof SalesPersonComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.initForm();
        this.salesPersonAction(SalesPersonActionEnum.GET_ALL);
        this.createUpdateSalesPersonSuccess$.pipe(takeUntil(this.destroyed$), filter(Boolean), tap(() => {
            this.salesPersonListIsModified = true;
            this.isFormSubmitted = false;
            this.salesPersonUniqueName = null;
            this.isEditMode = false;
            this.salesPersonForm.reset();
            this.salesPersonForm.markAsPristine();
            this.salesPersonAction(SalesPersonActionEnum.GET_ALL);
            this.focusInputField();
        })).subscribe();

        this.deleteSalesPersonSuccess$.pipe(takeUntil(this.destroyed$), filter(Boolean), tap(() => {
            this.salesPersonListIsModified = true;
            this.requestParams.page = this.generalService.adjustPageIndex(this.totalResults, this.requestParams.page, this.requestParams.count);
            this.salesPersonAction(SalesPersonActionEnum.GET_ALL);
        })).subscribe();
        this.salesPersonList$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.totalResults = res.totalItems;
            }
        });

        // Delete which liked with Account Only
        this.componentStore.openTransferAndDeleteDialog$.pipe(takeUntil(this.destroyed$), filter(Boolean), tap(() => {
            this.openTransferAndDeleteDialog(false, this.commonLocaleData?.app_delete, this.localeData?.delete_confirmation_message, this.localeData?.transfer_and_delete);
            this.componentStore.patchState({ openTransferAndDeleteDialog: false });
        })).subscribe();

        // Delete which liked with Voucher/ Entry
        this.componentStore.openTransferAndArchiveDialog$.pipe(takeUntil(this.destroyed$), filter(Boolean), tap(() => {
            const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                panelClass: ['mat-dialog-sm'],
                disableClose: true,
                data: {
                    configuration: this.generalService.deleteConfiguration(
                        this.localeData?.delete_with_voucher_message,
                        this.commonLocaleData
                    )
                }
            });
            dialogRef.afterClosed().subscribe(response => {
                if (response === this.commonLocaleData?.app_yes) {
                    this.openTransferAndDeleteDialog(false, this.commonLocaleData?.app_archive, this.localeData?.archive_alternative_message, this.localeData?.transfer_and_archive);
                } else {
                    this.salesPersonUniqueName = null;
                }
            });
            this.componentStore.patchState({ openTransferAndArchiveDialog: false });
        })).subscribe();

        this.componentStore.archiveSalesPersonSuccess$.pipe(takeUntil(this.destroyed$), filter(Boolean), tap((response: any) => {
            this.transferAndDeleteDialogRef?.close();
            this.transferAndArchiveDialogRef?.close();
            this.salesPersonListIsModified = true;
            if (this.salesPersonData?.activeSalePersonUniqueName === response.uniqueName) {
                this.activeSalePersonIsTransfer = response;
            }
            this.salesPersonAction(SalesPersonActionEnum.GET_ALL);
        })).subscribe();
    }

    /**
     * Initialize form
     *
     * @private
     * @memberof SalesPersonComponent
     */
    private initForm(value?: SalesPersonCreateUpdate): void {
        this.salesPersonForm = new FormGroup({
            name: new FormControl(value?.name || '', [Validators.required, Validators.maxLength(250)]),
            email: new FormControl(value?.email || '', [Validators.email]),
            mobileNumber: new FormControl(value?.mobileNumber || '')
        });
    }

    /**
     * Handle form submission
     *
     * @memberof SalesPersonComponent
     */
    public onSubmit(): void {
        this.isFormSubmitted = true;
        if (this.salesPersonForm?.valid) {
            this.salesPersonAction(this.isEditMode ? SalesPersonActionEnum.UPDATE : SalesPersonActionEnum.CREATE, this.salesPersonUniqueName);
        }
    }

    /**
     * Handle sales person action
     *
     * @param {SalesPersonActionEnum} action
     * @param {any} [element]
     * @memberof SalesPersonComponent
     */
    public salesPersonAction(action: SalesPersonActionEnum, element?: any): void {
        const salesPersonForm = this.salesPersonForm?.value;
        switch (action) {
            case SalesPersonActionEnum.CREATE:
                this.componentStore.createUpdateSalesPerson({ model: salesPersonForm, uniqueName: null });
                break;
            case SalesPersonActionEnum.UPDATE:
                this.componentStore.createUpdateSalesPerson({ model: salesPersonForm, uniqueName: this.salesPersonUniqueName });
                break;
            case SalesPersonActionEnum.DELETE:
                if (!element?.linkedEntities?.length) {
                    // Show delete confirmation only if sales person is not linked with any account/entry/voucher
                    const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                        panelClass: ['mat-dialog-sm'],
                        disableClose: true,
                        data: {
                            configuration: this.generalService.deleteConfiguration(
                                this.commonLocaleData?.app_permanently_delete_message,
                                this.commonLocaleData
                            )
                        }
                    });
                    dialogRef.afterClosed().subscribe(response => {
                        if (response === this.commonLocaleData?.app_yes) {
                            this.salesPersonUniqueName = element?.uniqueName;
                            this.componentStore.deleteSalesPerson(element?.uniqueName);
                        }
                    });
                } else {
                     if (element?.linkedEntities && element?.linkedEntities.includes(SalesPersonErrorDetailsEnum.ENTRY_VOUCHER)) {
                        this.salesPersonUniqueName = element?.uniqueName;
                        this.componentStore.patchState({
                            openTransferAndArchiveDialog: true
                        });
                    } else if (element?.linkedEntities && element?.linkedEntities.includes(SalesPersonErrorDetailsEnum.ACCOUNT)) {
                        this.salesPersonUniqueName = element?.uniqueName;
                        this.componentStore.patchState({
                            openTransferAndDeleteDialog: true
                        });
                    }
                }
                break;
            case SalesPersonActionEnum.EDIT:
                this.isEditMode = true;
                this.salesPersonUniqueName = element?.uniqueName;
                this.currentSalesPerson = element;
                this.initForm(element);
                this.openMatExpansionPanel = false;
                setTimeout(() => {
                    this.openMatExpansionPanel = true;
                    this.focusInputField();
                }, 0);
                break;
            case SalesPersonActionEnum.ARCHIVE:
                if (element.archiveStatus === SalesPersonArchiveEnum.ARCHIVE) {
                    const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                        panelClass: ['mat-dialog-sm'],
                        disableClose: true,
                        data: {
                            configuration: this.generalService.deleteConfiguration(
                                this.localeData?.unarchive_confirmation_message,
                                this.commonLocaleData
                            )
                        }
                    });
                    dialogRef.afterClosed().subscribe(response => {
                        if (response === this.commonLocaleData?.app_yes) {
                            this.componentStore.archiveUnarchiveSalesPerson({ model: { action: ActionTypeEnum.UNARCHIVED }, uniqueName: element?.uniqueName });
                        }
                    });
                } else {
                    this.salesPersonUniqueName = element?.uniqueName;
                    this.openTransferAndDeleteDialog(true, this.commonLocaleData?.app_archive, this.localeData?.archive_confirmation_message, this.localeData?.transfer_and_archive);
                }
                break;
            default:
                this.componentStore.getAllSalesPerson({ isDropdown: false, params: this.requestParams });
                break;
        }
    }

    /**
     * Focus on Name input field
     *
     * @private
     * @memberof SalesPersonComponent
     */
    private focusInputField(): void {
        this.nameField?.inputFocus();
    }

    /**
     * Closes the dialog
     *
     * @memberof SalesPersonComponent
     */
    public closeDialog(): void {
        let response = null;
        if (this.salesPersonListIsModified) {
            response = {
                isTransfer: this.activeSalePersonIsTransfer
            };
        }
        this.dialogRef?.close(response);
    }

    /**
     * Handle page change event and make API call
     *
     * @param {*} event
     * @memberof SalesPersonComponent
     */
    public handlePageChange(event: PageEvent): void {
        this.requestParams.page = this.requestParams.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.requestParams.count = event.pageSize;
        this.salesPersonAction(SalesPersonActionEnum.GET_ALL);
    }

    /**
     * Opens transfer and delete dialog for sales person
     *
     * @param {boolean} archiveOnly - if true, then dialog will be opened for transfer and delete
     * @param {string} title - dialog title
     * @param {string} message - dialog message
     * @param {string} primaryText - primary button text
     * @param {string} [secondaryText=this.commonLocaleData?.app_cancel] - secondary button text
     * @memberof SalesPersonComponent
     */
    public openTransferAndDeleteDialog(archiveOnly: boolean, title: string, message: string, primaryText: string, secondaryText: string = this.commonLocaleData?.app_cancel): void {
        this.transferAndDeleteDialogRef = this.dialog.open(ArchiveSalesPersonComponent, {
            panelClass: ['mat-dialog-sm'],
            disableClose: true,
            autoFocus: false,
            data: {
                commonLocaleData: this.commonLocaleData,
                salesPersonList$: this.salesPersonList$,
                salesPersonUniqueName: this.salesPersonUniqueName,
                archiveOnly,
                title,
                message,
                button: {
                    primaryText,
                    secondaryText
                }
            }
        });
        this.transferAndDeleteDialogRef.afterClosed().subscribe(model => {
            if (model) {
                this.componentStore.archiveUnarchiveSalesPerson({ model: model, uniqueName: this.salesPersonUniqueName });
            }
        });
    }

    /**
     * Releases memory
     *
     * @memberof SalesPersonComponent
     */
    public ngOnDestroy(): void {
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
