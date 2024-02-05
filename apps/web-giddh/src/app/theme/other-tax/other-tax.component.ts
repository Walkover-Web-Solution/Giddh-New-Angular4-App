import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Observable, ReplaySubject, takeUntil, of as observableOf, take } from "rxjs";
import { OtherTaxComponentStore } from "./utility/other-tax.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { CompanyActions } from "../../actions/company.actions";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

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
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Form Group for tax form */
    public otherTaxForm: UntypedFormGroup;
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** Create tax dialog ref  */
    public taxAsideMenuRef: MatDialogRef<any>;
        /** Hold aside menu state for other tax  */
        public asideMenuStateForOtherTaxes: string = 'out';

    constructor(
        private componentStore: OtherTaxComponentStore,
        private companyActions: CompanyActions,
        private formBuilder: UntypedFormBuilder,
        private dialog: MatDialog,
        private store: Store<AppState>,
    ) {

    }

    public ngOnInit(): void {
        this.initOtherTaxForm();
        this.getCompanyTaxes();
    }

    /**
     * Initializes voucher form
     *
     * @private
     * @memberof CreateDiscountComponent
     */
    private initOtherTaxForm(): void {
        this.otherTaxForm = this.formBuilder.group({
            type: ['', Validators.required],
            name: ['', Validators.required],
            discountValue: ['', Validators.required],
            accountUniqueName: ['', Validators.required],
        });
    }

    public getCompanyTaxes(): void {
        this.companyTaxes$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response)
            if (!response) {
                this.store.dispatch(this.companyActions.getTax());
            } else {
                let taxResponse = response
                    ?.filter(f => ['tcsrc', 'tcspay', 'tdsrc', 'tdspay'].includes(f.taxType))
                    .map(m => {
                        return { label: m.name, value: m?.uniqueName };
                    })
                console.log(taxResponse)
                this.companyTaxes$ = observableOf(taxResponse)
            }
        });
    }

    public saveTax(): void {
        console.log(this.otherTaxForm)
        this.isFormSubmitted = false;
        if (this.otherTaxForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        // this.componentStore.saveDiscount(this.createDiscountForm.value);
    }

    public createTaxDialog():void {
        if (this.asideMenuStateForOtherTaxes === 'in') {
            this.toggleOtherTaxesAsidePane(true);
        }
    }

    public toggleOtherTaxesAsidePane(event?: any): void {
        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
    }

    public selectTax(event: any, isClear: any): void {
        if (isClear) {
            this.otherTaxForm.reset();
        } else {
            this.otherTaxForm.get("linkedAccount")?.patchValue(event?.label);
        }
    }


    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}