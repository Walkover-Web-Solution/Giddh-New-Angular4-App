import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, Observable, ReplaySubject, take, takeUntil, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SalesPersonComponentStore } from './utility/sales-person.store';
import { SalesPersonService } from './utility/sales-person.service';
import { KeyboardShortutModule } from '../helpers/directives/keyboardShortcut/keyboardShortut.module';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { IntlPhoneLib } from '../../theme/mobile-number-field/intl-phone-lib.class';
import { GiddhPageLoaderModule } from '../giddh-page-loader/giddh-page-loader.module';
import { ElementViewChildModule } from '../helpers/directives/elementViewChild/elementViewChild.module';
import { MatTableModule } from '@angular/material/table';
import { SalesPersonActionEnum, SalesPersonCreateUpdate } from './utility/sales-person.constant';
import { InputFieldComponent } from '../../theme/form-fields/input-field/input-field.component';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';
import { GeneralService } from '../../services/general.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS } from '../../app.constant';

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
        ElementViewChildModule
    ],
    templateUrl: './sales-person.component.html',
    styleUrls: ['./sales-person.component.scss'],
    providers: [SalesPersonService, SalesPersonComponentStore]
})

export class SalesPersonComponent implements OnInit, AfterViewInit, OnDestroy {
    /** ViewChild reference for name field */
    @ViewChild('nameField') nameField: InputFieldComponent;
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Mobile number library instance */
    public intlClass: any;
    /** Form submission flag */
    public isFormSubmitted: boolean = false;
    /** Sales Person List is modified */
    public salesPersonListIsModified: boolean = false;
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
    public displayedColumns: string[] = ['name', 'email', 'mobileNumber', 'action'];
    /** Active Row Index */
    public activeRowIndex: number = -1;
    /** Sales Person Action Enum */
    public salesPersonActionEnum = SalesPersonActionEnum;
    /** Sales Person Unique Name in case of user edit or delete */
    public salesPersonUniqueName: string | null = null;
    /** Holds page Size Options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Holds advance Filters keys */
    public requestParams: any = {
        page: 1,
        count: this.pageSizeOptions[0]
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) public salesPersonData: any,
        public dialogRef: MatDialogRef<any>,
        private componentStore: SalesPersonComponentStore,
        private changeDetection: ChangeDetectorRef,
        private elementRef: ElementRef,
        private generalService: GeneralService,
        private dialog: MatDialog
    ) { }

    /**
     * Lifecycle hook runs on component initialization
     *
     * @memberof SalesPersonComponent
     */
    public ngOnInit(): void {
        this.salesPersonUniqueName = this.salesPersonData?.uniqueName || null;
        this.initForm(this.salesPersonUniqueName ? this.salesPersonData : undefined);
        this.salesPersonAction(SalesPersonActionEnum.GET_ALL);
        this.createUpdateSalesPersonSuccess$.pipe(takeUntil(this.destroyed$), filter(Boolean), tap(() => {
            this.salesPersonListIsModified = true;
            this.isFormSubmitted = false;
            this.salesPersonForm.reset();
            this.salesPersonForm.markAsPristine();
            this.salesPersonAction(SalesPersonActionEnum.GET_ALL);
        })).subscribe();
        this.deleteSalesPersonSuccess$.pipe(takeUntil(this.destroyed$), filter(Boolean), tap(() => { this.salesPersonListIsModified = true })).subscribe();
    }

    /**
     * Lifecycle hook runs after component view initialization
     *
     * @memberof SalesPersonComponent
     */
    public ngAfterViewInit(): void {
        this.initIntl(this.salesPersonUniqueName ? this.salesPersonData?.mobileNumber : undefined);
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
            this.salesPersonAction(this.salesPersonUniqueName ? SalesPersonActionEnum.UPDATE : SalesPersonActionEnum.CREATE, this.salesPersonUniqueName);
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
        switch (action) {
            case SalesPersonActionEnum.CREATE:
                const model = this.salesPersonForm?.value;
                model.mobileNumber = model.mobileNumber ? (this.intlClass.selectedCountryData.dialCode + model.mobileNumber) : null;
                this.componentStore.createUpdateSalesPerson({ model: model, uniqueName: null });
                break;
            case SalesPersonActionEnum.UPDATE:
                this.componentStore.createUpdateSalesPerson({ model: this.salesPersonForm?.value, uniqueName: this.salesPersonUniqueName });
                break;
            case SalesPersonActionEnum.DELETE:
                const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                    panelClass: ['mat-dialog-sm'],
                    data: {
                        configuration: this.generalService.deleteConfiguration(
                            this.commonLocaleData?.app_permanently_delete_message,
                            this.commonLocaleData
                        )
                    }
                });
                dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                    if (response === this.commonLocaleData?.app_yes) {
                        this.componentStore.deleteSalesPerson(element?.uniqueName);
                    }
                });
                break;
            case SalesPersonActionEnum.EDIT:
                this.salesPersonUniqueName = element?.uniqueName;
                this.initForm(element);
                // this.salesPersonForm?.setValue({
                //     name: element?.name,
                //     email: element?.email,
                //     mobileNumber: element?.mobileNumber
                // });
                if (element?.mobileNumber) {
                    this.initIntl(element?.mobileNumber);
                } else {
                    this.initIntl();
                }
                this.openMatExpansionPanel = false;
                setTimeout(() => {
                    this.openMatExpansionPanel = true;
                }, 0);
                this.nameField?.inputFocus();
                break;
            default:
                this.componentStore.getAllSalesPerson({ isDropdown: false, params: this.requestParams});
                break;
        }
    }

    /**
     * Initializes the int-tel input
     *
     * @memberof SalesPersonComponent
 */
    public initIntl(inputValue?: string): void {
        let times = 0;
        const parentDom = this.elementRef?.nativeElement;
        const input = document.getElementById('init-sales-person-contact');
        const interval = setInterval(() => {
            times += 1;
            if (input) {
                clearInterval(interval);
                this.intlClass = new IntlPhoneLib(
                    input,
                    parentDom,
                    false
                );
                if (inputValue) {
                    input.setAttribute('value', `+${inputValue}`);
                } else {
                    input.setAttribute('value', '');
                }
                this.changeDetection.detectChanges();
            }
            if (times > 25) {
                clearInterval(interval);
            }
        }, 50);
    }


    /**
     * Validate the mobile number
     *
     * @memberof SalesPersonComponent
 */
    public validateMobileField(): void {
        if (!this.intlClass?.isRequiredValidNumber) {
            this.salesPersonForm.get("mobileNumber")?.setErrors({ invalidNumber: true });
        } else {
            this.salesPersonForm.get("mobileNumber")?.setErrors(null);
        }
    }

    /**
     * Closes the dialog
     *
     * @memberof SalesPersonComponent
     */
    public closeDialog(): void {
        this.dialogRef?.close(this.salesPersonListIsModified);
    }

    /**
     * Handle page change event and make API call
     *
     * @param {*} event
     * @memberof SalesPersonComponent
     */
    public handlePageChange(event: any): void {
        this.requestParams.page = event.pageIndex + 1;
        this.requestParams.count = event.pageSize;
        this.salesPersonAction(SalesPersonActionEnum.GET_ALL);
    }

    /**
     * Releases memory
     *
     * @memberof SalesPersonComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
