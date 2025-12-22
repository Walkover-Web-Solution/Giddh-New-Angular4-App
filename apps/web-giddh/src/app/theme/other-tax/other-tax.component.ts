import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Observable, ReplaySubject, takeUntil, of as observableOf, of } from "rxjs";
import { OtherTaxComponentStore } from "./utility/other-tax.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { CompanyActions } from "../../actions/company.actions";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SettingsTaxesActions } from "../../actions/settings/taxes/settings.taxes.action";
import { ASIDE_PANE_CONFIG } from "../../app.constant";

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
    public taxAsideMenuRef: MatDialogRef<any> = null;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if create tax dialog is open  */
    public otherTax: boolean = false;
    /** Calculation method options for dropdown */
    public calculationMethodOptions: any[] = [];
    /** This will open account dropdown by default */
    public openAccountDropdown: boolean = false;

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
            tax: [appliedOtherTax, Validators.required],
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
        const form = this.otherTaxForm.value;
        if (!form?.tax?.uniqueName || !form?.calculationMethod) {
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
        this.taxAsideMenuRef = this.dialog.open(this.createTax, ASIDE_PANE_CONFIG);
        this.taxAsideMenuRef.afterClosed().subscribe(() => {
            this.taxAsideMenuRef = null;
            this.openAccountDropdown = false; 
            setTimeout(() => {
                this.openAccountDropdown = true;
            }, 50);
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
     * Callback for translation completion
     *
     * @param {*} event
     * @memberof OtherTaxComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.initCalculationMethodOptions();
        }
    }

    /**
     * Initializes calculation method options for dropdown
     *
     * @private
     * @memberof OtherTaxComponent
     */
    private initCalculationMethodOptions(): void {
        this.calculationMethodOptions = [
            { label: this.commonLocaleData?.app_on_taxable_value, value: 'OnTaxableAmount' },
            { label: this.commonLocaleData?.app_on_total_value, value: 'OnTotalAmount' }
        ];
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