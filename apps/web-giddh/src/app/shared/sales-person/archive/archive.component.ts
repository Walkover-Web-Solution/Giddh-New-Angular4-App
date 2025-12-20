import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ActionTypeEnum } from '../utility/sales-person.constant';
import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
import { SalesPersonComponentStore } from '../utility/sales-person.store';
import { filter, ReplaySubject, takeUntil, Subscription } from 'rxjs';
import { API_BULK_FETCH_LIMIT, IOption } from '../../../app.constant';
import { get } from '../../../lodash-optimized';

@Component({
    selector: 'archive',
    templateUrl: './archive.component.html',
    providers: [SalesPersonComponentStore],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        FormFieldsModule
    ]
})
export class ArchiveSalesPersonComponent implements OnInit, OnDestroy {
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    /** Archive form */
    public archiveForm: FormGroup = new FormGroup({
        action: new FormControl<ActionTypeEnum>(ActionTypeEnum.UNASSIGNED, [Validators.required]),
        uniqueName: new FormControl<string>(ActionTypeEnum.UNASSIGNED),
        archiveOnly: new FormControl<boolean>(false)
    });
    /** Sales Person List */
    public salesPersonList: IOption[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<ArchiveSalesPersonComponent>,
        private salesPersonStore: SalesPersonComponentStore
    ) { }

    /**
     * Lifecycle hook runs on component initialization
     * 
     * @memberof ArchiveSalesPersonComponent
     */
    public ngOnInit(): void {
        this.getSalesPersonList();
        this.salesPersonStore.salesPersonList$.pipe(takeUntil(this.destroyed$), filter(Boolean)).subscribe((salesPersonList: IOption[]) => {
            this.salesPersonList = [{
                label: this.inputData?.commonLocaleData?.app_unassigned,
                value: ActionTypeEnum.UNASSIGNED
            }, ...salesPersonList?.filter((item: IOption) => item.value !== this.inputData?.salesPersonUniqueName) || []]; // filter out the current sales person
        });
    }

    /**
     * Submit form
     * 
     * @memberof ArchiveSalesPersonComponent
     */
    public submit(): void {
        const form = this.archiveForm.value;
        form.archiveOnly = Boolean(this.inputData?.archiveOnly);
        if (form.uniqueName === ActionTypeEnum.UNASSIGNED) {
            form.action = ActionTypeEnum.UNASSIGNED;
            delete form.uniqueName;
        } else {
            form.action = ActionTypeEnum.TRANSFER;
        }
        this.dialogRef.close(form);
    }

    /**
     * Handle clear
     * 
     * @memberof ArchiveSalesPersonComponent
     */
    public handleClear(): void {
        this.archiveForm.get('action')?.setValue(ActionTypeEnum.UNASSIGNED);
    }

    /**
     * Get sales person list as label value
     *
     * @memberof ArchiveSalesPersonComponent
     */
    public getSalesPersonList(): void {
        this.salesPersonStore.getAllSalesPerson({ isDropdown: true, params: { page: 1, count: API_BULK_FETCH_LIMIT } });
    }

    /**
     * Releases memory
     *
     * @memberof ArchiveSalesPersonComponent
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
