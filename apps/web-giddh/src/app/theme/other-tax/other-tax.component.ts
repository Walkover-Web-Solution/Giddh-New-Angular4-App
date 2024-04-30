import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Observable, ReplaySubject, takeUntil, of as observableOf, of } from "rxjs";
import { OtherTaxComponentStore } from "./utility/other-tax.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { CompanyActions } from "../../actions/company.actions";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SettingsTaxesActions } from "../../actions/settings/taxes/settings.taxes.action";

@Component({
    selector: "other-tax",
    templateUrl: "./other-tax.component.html",
    styleUrls: ["./other-tax.component.scss"],
    providers: [OtherTaxComponentStore],
})
export class OtherTaxComponent implements OnInit, OnDestroy {
    /** Template Reference for Create Tax aside menu */
    @ViewChild("createTax") public createTax: TemplateRef<any>;
    /** Company taxes Observable */
    public companyTaxes$: Observable<any> = this.componentStore.companyTaxes$;
    /** Tax list observable */
    public taxesList$: Observable<any> = of(null);
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Form Group for tax form */
    public otherTaxForm: FormGroup;
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** Create tax dialog ref  */
    public taxAsideMenuRef: MatDialogRef<any>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if create tax dialog is open  */
    public otherTax: boolean = false;

    constructor(
        private componentStore: OtherTaxComponentStore,
        private companyActions: CompanyActions,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private store: Store<AppState>,
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public inputData,
        private settingsTaxesAction: SettingsTaxesActions
    ) {

    }

    /**
     * Hook cycle for component initialization
     *
     * @memberof OtherTaxComponent
     */
    public ngOnInit(): void {
        this.store.dispatch(this.settingsTaxesAction.CreateTaxResponse(null));
        this.initOtherTaxForm(this.inputData?.appliedOtherTax);
        this.getCompanyTaxes();
    }

    /**
     * Initializes other tax form
     *
     * @private
     * @memberof OtherTaxComponent
     */
    private initOtherTaxForm(appliedOtherTax?: any): void {
        this.otherTaxForm = this.formBuilder.group({
            tax: [appliedOtherTax],
            name: [appliedOtherTax?.name],
            calculationMethod: [appliedOtherTax?.calculationMethod || 'OnTaxableAmount', Validators.required],
            entryIndex: [this.inputData?.entryIndex]
        });
    }

    /**
     * This will be use for get company taxes
     *
     * @memberof OtherTaxComponent
     */
    public getCompanyTaxes(): void {
        this.companyTaxes$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (!response) {
                this.store.dispatch(this.companyActions.getTax());
            } else {
                let taxResponse = response?.filter(tax => ['tcsrc', 'tcspay', 'tdsrc', 'tdspay'].includes(tax.taxType)).map(tax => {
                    return { label: tax.name, value: tax };
                });
                this.taxesList$ = observableOf(taxResponse);
            }
        });
    }

    /**
     * This will be use for save tax
     *
     * @return {*}  {void}
     * @memberof OtherTaxComponent
     */
    public saveTax(): void {
        this.isFormSubmitted = false;
        if (this.otherTaxForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        this.dialogRef.close(this.otherTaxForm?.value);
    }

    /**
     * This will be use for open create tax dialog 
     *
     * @memberof OtherTaxComponent
     */
    public createTaxDialog(): void {
        this.taxAsideMenuRef = this.dialog.open(this.createTax, {
            position: {
                right: '0',
                top: '0'
            }
        });
        this.otherTax = true;
    }

    /**
     * This will be use for close create tax dialog 
     *
     * @memberof OtherTaxComponent
     */
    public closeCreateTaxDialog(): void {
        this.taxAsideMenuRef.close();
        this.otherTax = false;
    }

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof OtherTaxComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}