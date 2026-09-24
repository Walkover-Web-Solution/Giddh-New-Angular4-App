import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../app.constant';
import { IAllTransporterDetails, IEwayBillTransporter, IEwayBillfilter } from '../../models/api-models/Invoice';
import { AppState } from '../../store';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { InputFieldComponent } from '../../theme/form-fields/input-field/input-field.component';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GeneralService } from '../../services/general.service';
import { KeyboardShortutModule } from '../helpers/directives/keyboardShortcut/keyboardShortut.module';
import { KeyboardNavigationModule } from '../helpers/directives/enter-next/keyboard-navigation.module';

@Component({
    selector: 'app-manage-transporter',
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
        MatSortModule,
        MatMenuModule,
        KeyboardShortutModule,
        TranslateDirectiveModule,
        KeyboardNavigationModule
    ],
    templateUrl: './manage-transporter.component.html',
    styleUrls: ['./manage-transporter.component.scss']
})
export class ManageTransporterComponent implements OnInit, OnDestroy, AfterViewInit {
    /** Name field reference for focus */
    @ViewChild('nameField') public nameField: InputFieldComponent;
    /** Dialog reference */
    private readonly dialogRef = inject(MatDialogRef<ManageTransporterComponent>);
    /** Mat dialog */
    private readonly dialog = inject(MatDialog);
    /** Store */
    private readonly store = inject(Store<AppState>);
    /** Invoice actions */
    private readonly invoiceActions = inject(InvoiceActions);
    /** General service */
    private readonly generalService = inject(GeneralService);
    /** Subject to release subscription memory */
    private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Common locale data */
    public commonLocaleData: any = {};
    /** Locale data */
    public localeData: any = {};
    /** Form submission flag */
    public isFormSubmitted: boolean = false;
    /** True to open mat-expansion-panel */
    public openMatExpansionPanel: boolean = true;
    /** True if edit mode */
    public isEditMode: boolean = false;
    /** Current transporter id being edited */
    public currentTransporterId: string | null = null;
    /** Active row index for action menu visibility */
    public activeRowIndex: number = -1;
    /** True when list was modified (create/update/delete) */
    public listIsModified: boolean = false;
    /** True when a create/update request was initiated from this dialog */
    private pendingSaveAction: boolean = false;
    /** Transporter form */
    public transporterForm: FormGroup;
    /** Transporter list */
    public transporterList$: Observable<IEwayBillTransporter[]> = this.store.pipe(
        select(state => state.ewaybillstate.TransporterList),
        takeUntil(this.destroyed$)
    );
    /** Transporter list pagination details */
    public transporterListDetails: IAllTransporterDetails;
    /** Save in progress */
    public saveInProgress$: Observable<boolean> = this.store.pipe(
        select(state => state.ewaybillstate.isAddnewTransporterInProcess),
        takeUntil(this.destroyed$)
    );
    /** Update in progress */
    public updateInProgress$: Observable<boolean> = this.store.pipe(
        select(state => state.ewaybillstate.updateTransporterInProcess),
        takeUntil(this.destroyed$)
    );
    /** Displayed columns */
    public displayedColumns: string[] = ['transporterName', 'transporterId', 'action'];
    /** Page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Transporter filter request */
    public transporterFilterRequest: IEwayBillfilter = new IEwayBillfilter();

    /**
     * Initializes component
     *
     * @memberof ManageTransporterComponent
     */
    public ngOnInit(): void {
        this.transporterFilterRequest.page = 1;
        this.transporterFilterRequest.count = PAGINATION_LIMIT;
        this.initForm();
        this.getTransporterList();

        this.store.pipe(
            select(state => state.ewaybillstate.TransporterListDetails),
            takeUntil(this.destroyed$)
        ).subscribe((response) => {
            if (response) {
                this.transporterListDetails = response;
            }
        });

        this.store.pipe(
            select(state => state.ewaybillstate.isAddnewTransporterInSuccess),
            takeUntil(this.destroyed$),
            filter(Boolean),
            tap(() => {
                if (!this.pendingSaveAction) {
                    return;
                }
                this.pendingSaveAction = false;
                this.listIsModified = true;
                this.resetFormState();
                this.getTransporterList();
            })
        ).subscribe();

        this.store.pipe(
            select(state => state.ewaybillstate.updateTransporterSuccess),
            takeUntil(this.destroyed$),
            filter(Boolean),
            tap(() => {
                if (!this.pendingSaveAction) {
                    return;
                }
                this.pendingSaveAction = false;
                this.listIsModified = true;
                this.resetFormState();
                this.getTransporterList();
            })
        ).subscribe();
    }

    /**
     * Focus name field after view init
     *
     * @memberof ManageTransporterComponent
     */
    public ngAfterViewInit(): void {
        this.focusInputField();
    }

    /**
     * Initializes transporter form
     *
     * @private
     * @param {IEwayBillTransporter} [value]
     * @memberof ManageTransporterComponent
     */
    private initForm(value?: IEwayBillTransporter): void {
        this.transporterForm = new FormGroup({
            transporterName: new FormControl(value?.transporterName || '', [
                Validators.required,
                Validators.pattern(/^[a-zA-Z0-9^ .&]{5,100}$/)
            ]),
            transporterId: new FormControl(value?.transporterId || '', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(15),
                Validators.pattern(/^[0-9]{2}[0-9A-Z]{13}$/)
            ])
        });
    }

    /**
     * Fetches transporter list
     *
     * @private
     * @memberof ManageTransporterComponent
     */
    private getTransporterList(): void {
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
    }

    /**
     * Handles form submit for create/update
     *
     * @memberof ManageTransporterComponent
     */
    public onSubmit(): void {
        this.isFormSubmitted = true;
        if (this.transporterForm?.invalid) {
            return;
        }
        if (this.isEditMode && this.currentTransporterId) {
            this.pendingSaveAction = true;
            this.store.dispatch(
                this.invoiceActions.updateEwayBillTransporter(this.currentTransporterId, this.transporterForm.value)
            );
        } else {
            this.pendingSaveAction = true;
            this.store.dispatch(this.invoiceActions.addEwayBillTransporter(this.transporterForm.value));
        }
    }

    /**
     * Clears form and exits edit mode
     *
     * @memberof ManageTransporterComponent
     */
    public clearForm(): void {
        this.resetFormState();
        this.focusInputField();
    }

    /**
     * Resets form state after success or clear
     *
     * @private
     * @memberof ManageTransporterComponent
     */
    private resetFormState(): void {
        this.isFormSubmitted = false;
        this.isEditMode = false;
        this.currentTransporterId = null;
        this.transporterForm.reset();
        this.transporterForm.markAsPristine();
        this.focusInputField();
    }

    /**
     * Loads transporter into form for edit
     *
     * @param {IEwayBillTransporter} transporter
     * @memberof ManageTransporterComponent
     */
    public editTransporter(transporter: IEwayBillTransporter): void {
        if (!transporter) {
            return;
        }
        this.isEditMode = true;
        this.currentTransporterId = transporter.transporterId;
        this.initForm(transporter);
        this.openMatExpansionPanel = false;
        setTimeout(() => {
            this.openMatExpansionPanel = true;
            this.focusInputField();
        }, 0);
    }

    /**
     * Deletes a transporter after confirmation
     *
     * @param {IEwayBillTransporter} transporter
     * @memberof ManageTransporterComponent
     */
    public deleteTransporter(transporter: IEwayBillTransporter): void {
        if (!transporter?.transporterId) {
            return;
        }
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
        dialogRef.afterClosed().subscribe((response) => {
            if (response === this.commonLocaleData?.app_yes) {
                this.store.dispatch(this.invoiceActions.deleteTransporter(transporter.transporterId));
                this.listIsModified = true;
                const totalItems = this.transporterListDetails?.totalItems ?? 0;
                this.transporterFilterRequest.page = this.generalService.adjustPageIndex(
                    totalItems,
                    this.transporterFilterRequest.page,
                    this.transporterFilterRequest.count
                );
                this.getTransporterList();
            }
            this.focusInputField();
        });
    }

    /**
     * Handles pagination
     *
     * @param {PageEvent} event
     * @memberof ManageTransporterComponent
     */
    public handlePageChange(event: PageEvent): void {
        this.transporterFilterRequest.page = this.transporterFilterRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.transporterFilterRequest.count = event.pageSize;
        this.getTransporterList();
    }

    /**
     * Handles table sort
     *
     * @param {Sort} event
     * @memberof ManageTransporterComponent
     */
    public sortChange(event: Sort): void {
        this.transporterFilterRequest.sort = event?.direction || '';
        this.transporterFilterRequest.sortBy = event?.active || '';
        this.getTransporterList();
    }

    /**
     * Focuses name input
     *
     * @private
     * @memberof ManageTransporterComponent
     */
    private focusInputField(): void {
        setTimeout(() => {
            if (this.nameField && typeof this.nameField.inputFocus === 'function') {
                this.nameField.inputFocus();
            }
        }, 0);
    }

    /**
     * Closes dialog
     *
     * @memberof ManageTransporterComponent
     */
    public closeDialog(): void {
        this.dialogRef?.close(this.listIsModified ? { isModified: true } : null);
    }

    /**
     * Releases memory
     *
     * @memberof ManageTransporterComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
