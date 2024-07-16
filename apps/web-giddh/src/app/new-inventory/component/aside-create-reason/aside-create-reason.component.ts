import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AdjustInventoryComponentStore } from '../adjust-inventory/utility/adjust-inventory.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
    selector: 'aside-create-reason',
    templateUrl: './aside-create-reason.component.html',
    styleUrls: ['./aside-create-reason.component.scss'],
    providers: [AdjustInventoryComponentStore]
})
export class AsideCreateNewReasonComponent implements OnDestroy, OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will hold locale JSON data */
    public localeData: any = {};
    /** Emits modal close event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Holds Store create reason in progress API success state as observable*/
    public createReasonInProgress$ = this.componentStore.select(state => state.createReasonInProgress);
    /** Form Group for Reason form */
    public reasonForm: FormGroup;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds if form is valid or not */
    public isValidForm: boolean = true;

    constructor(
        private componentStore: AdjustInventoryComponentStore,
        private formBuilder: FormBuilder
    ) { }

    /**
     * Lifecycle hook for init component
     *
     * @memberof AsideCreateNewReasonComponent
     */
    public ngOnInit(): void {
        this.initReasonForm();
        this.componentStore.createReasonIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.closeAsideEvent.emit(true);
            }
        });
    }

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof AsideCreateNewReasonComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
    * Reset form
    *
    * @memberof AsideCreateNewReasonComponent
    */
    public resetForm(): void {
        this.reasonForm?.reset();
    }

    /**
     * Initializes reason form
     *
     * @memberof AsideCreateNewReasonComponent
     */
    public initReasonForm(): void {
        this.reasonForm = this.formBuilder.group({
            reason: ['', Validators.required]
        });
    }

    /**
     * Save reason
     *
     * @memberof AsideCreateNewReasonComponent
     */
    public saveReason(): void {
        this.isValidForm = !this.reasonForm.invalid;
        if (this.reasonForm.invalid) {
            return;
        }
        this.componentStore.createReason(this.reasonForm.value);
    }
}

