import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { Store, select } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../../store';
import { AgingReportActions } from '../../actions/aging-report.actions';
import { FormFieldsModule } from '../form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';

/**
 * Aging range option payload used across the app.
 * Mirrors the shape of `AgingDropDownoptions` (fourth/fifth/sixth) so it can be
 * consumed by the contact aging report as well as the stock aging report.
 */
/** Editable upper-bound fields, in ascending order. */
export type AgeRangeEditorField = 'fourth' | 'fifth' | 'sixth';

export interface AgeRangeEditorOptions {
    /** Upper bound of the first interval (e.g. 30 for "0-30") */
    fourth: number;
    /** Upper bound of the second interval (e.g. 60 for "31-60") */
    fifth: number;
    /** Upper bound of the third interval (e.g. 90 for "61-90") */
    sixth: number;
}

/**
 * Presentational (dumb) popup that shows all four aging intervals
 * (First / Second / Third / Last) side by side with their upper bounds editable.
 *
 * - Emits `save` with the new options only when the user confirms with the
 *   Apply button or Enter, and `close` when the popup should be dismissed.
 * - Cancelling or clicking outside discards the edits without saving.
 * - Auto-focuses the clicked interval's input so users can type and press Enter.
 */
@Component({
    selector: 'age-range-editor',
    templateUrl: './age-range-editor.component.html',
    styleUrls: ['./age-range-editor.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ClickOutsideModule, FormFieldsModule, MatButtonModule],
})
export class AgeRangeEditorComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    /** Current interval boundaries. Cloned internally to keep the input pure. */
    @Input() public options: AgeRangeEditorOptions = { fourth: 0, fifth: 0, sixth: 0 };
    /** Index of the clicked interval (0=first, 1=second, 2=third, 3=last); decides which input is focused */
    @Input() public activeInterval: number = 0;
    /** Locale keys for interval titles ({ first_interval, second_interval, third_interval, last_interval }) */
    @Input() public localeData: any = {};
    /** Common locale keys used for the Apply / Cancel actions */
    @Input() public commonLocaleData: any = {};
    /** Optional error message displayed when values violate the ascending rule */
    @Input() public errorMessage: string = 'Ranges must be in ascending order';
    /** Optional extra CSS classes applied to the popup container */
    @Input() public cssClass: string = '';
    /**
     * Value forwarded to the due-days-range API as `vendorCustomerType`.
     * Callers pass 'customer' / 'vendor' for contact aging, 'inventory' for
     * stock aging, etc. When set, the editor dispatches `CreateDueRange`
     * itself on save so the parent doesn't have to.
     */
    @Input() public vendorCustomerType: string = '';

    /** Emitted with the validated, cloned options when the user saves. */
    @Output() public save: EventEmitter<AgeRangeEditorOptions> = new EventEmitter<AgeRangeEditorOptions>();
    /** Emitted when the popup should be dismissed (cancel / click outside). */
    @Output() public close: EventEmitter<void> = new EventEmitter<void>();

    /** Local, editable copy of the options so we don't mutate the parent input directly. */
    public model: AgeRangeEditorOptions = { fourth: 0, fifth: 0, sixth: 0 };
    /** True when local model values are in a valid ascending order. */
    public isValid: boolean = true;
    /** Message describing the current validation failure. */
    public validationMessage: string = '';
    /** Field edited last; the validation message is phrased around it. */
    private lastEditedField: AgeRangeEditorField = null;
    /** True once the user has changed any value; Apply is a no-op without it. */
    private dirty: boolean = false;
    /** Cleanup subject for the store subscription. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /**
     * Payload buffered between the moment we dispatch `CreateDueRange` and
     * the moment the request completes successfully. When the in-flight flag
     * transitions from true→false, we emit `save` with this payload.
     */
    private pendingSavePayload: AgeRangeEditorOptions | null = null;
    /** Tracks the previous in-flight value to detect the true→false edge. */
    private wasRequestInFlight: boolean = false;

    constructor(
        private elementRef: ElementRef,
        private store: Store<AppState>,
        private agingReportActions: AgingReportActions,
    ) {}

    /**
     * Subscribe to the due-range in-flight flag so we can emit `save` only
     * *after* the persist request completes successfully.
     */
    public ngOnInit(): void {
        this.store.pipe(
            select(state => state.agingreport.setDueRangeRequestInFlight),
            takeUntil(this.destroyed$),
        ).subscribe(inFlight => {
            if (inFlight) {
                this.wasRequestInFlight = true;
            } else if (this.wasRequestInFlight) {
                this.wasRequestInFlight = false;
                if (this.pendingSavePayload) {
                    this.save.emit(this.pendingSavePayload);
                    this.pendingSavePayload = null;
                }
            }
        });
    }

    /**
     * Cleanup the store subscription.
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Sync the local editable model whenever the parent supplies new options.
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['options'] && this.options) {
            this.resetModel();
        }
    }

    /**
     * Auto-focus the upper-bound input of the interval the user clicked. The
     * last interval has no editable bound, so it falls back to the third one.
     */
    public ngAfterViewInit(): void {
        setTimeout(() => {
            const host = this.elementRef?.nativeElement as HTMLElement;
            const inputs = host?.querySelectorAll<HTMLInputElement>('.range-input:not([disabled])');
            const target = inputs?.[Math.min(this.activeInterval, inputs.length - 1)];
            if (target) {
                target.focus({ preventScroll: true });
            }
        }, 0);
    }

    /**
     * Called after each edit of a `To` input. Validates the ascending
     * constraint and marks the model dirty so Apply has something to persist.
     */
    public onValueChange(field?: AgeRangeEditorField): void {
        this.model.fourth = Number(this.model.fourth);
        this.model.fifth = Number(this.model.fifth);
        this.model.sixth = Number(this.model.sixth);
        this.dirty = true;
        this.lastEditedField = field ?? this.lastEditedField;
        this.isValid = this.validate();
    }

    /**
     * Persists the edited values. Triggered by the Apply button and by Enter.
     * Does nothing while the values are invalid; closes without saving when
     * nothing was edited.
     */
    public applyChanges(): void {
        if (!this.isValid) {
            return;
        }
        if (!this.dirty) {
            this.close.emit();
            return;
        }
        const payload = { ...this.model };
        if (this.vendorCustomerType) {
            // Persist to the shared due-days-range endpoint. Buffer the
            // payload; `save` will be emitted from the in-flight
            // subscription once the request completes successfully so
            // the parent's side-effects (e.g. refetch) run against the
            // fresh backend state.
            this.pendingSavePayload = payload;
            this.store.dispatch(this.agingReportActions.CreateDueRange({
                range: [
                    payload.fourth?.toString(),
                    payload.fifth?.toString(),
                    payload.sixth?.toString(),
                ],
                vendorCustomerType: this.vendorCustomerType,
            }));
        } else {
            // No persistence configured — emit synchronously.
            this.save.emit(payload);
        }
    }

    /**
     * Discards the edits, restores the values supplied by the parent and
     * dismisses the popup. Used by the Cancel button and by clicking outside.
     */
    public onCancel(): void {
        this.resetModel();
        this.close.emit();
    }

    /**
     * Handles the "outside click" that dismisses the popup. Edits are never
     * persisted this way — the user has to confirm with Apply or Enter.
     */
    public onClickOutside(_event?: any): void {
        this.onCancel();
    }

    /**
     * Restores the local model from the parent-supplied options.
     */
    private resetModel(): void {
        this.model = {
            fourth: Number(this.options?.fourth) || 0,
            fifth: Number(this.options?.fifth) || 0,
            sixth: Number(this.options?.sixth) || 0,
        };
        this.dirty = false;
        this.lastEditedField = null;
        this.isValid = this.validate();
    }

    /**
     * Validate that fourth < fifth < sixth and describe the violation in
     * `validationMessage`. Used to gate the save emission.
     */
    private validate(): boolean {
        const { fourth, fifth, sixth } = this.model;
        if (fourth < fifth && fifth < sixth) {
            this.validationMessage = '';
            return true;
        }
        // Report the bounds of the field the user just typed in; when the
        // popup opens on already invalid data, blame the first broken pair.
        const field = this.lastEditedField ?? (fifth <= fourth ? 'fifth' : 'sixth');
        this.validationMessage = this.buildRangeErrorMessage(field);
        return false;
    }

    /**
     * Build the localised message stating the numeric window a field accepts,
     * falling back to the generic `errorMessage` input when no template exists.
     */
    private buildRangeErrorMessage(field: AgeRangeEditorField): string {
        const { fourth, fifth, sixth } = this.model;
        const titles: Record<AgeRangeEditorField, string> = {
            fourth: this.localeData?.first_interval,
            fifth: this.localeData?.second_interval,
            sixth: this.localeData?.third_interval,
        };
        let min: number = null;
        let max: number = null;
        if (field === 'fourth') {
            max = fifth;
        } else if (field === 'fifth') {
            min = fourth;
            max = sixth > fourth + 1 ? sixth : null;
        } else {
            min = fifth;
        }

        const template = min !== null && max !== null
            ? this.localeData?.aging_range_error_between
            : (min !== null ? this.localeData?.aging_range_error_min : this.localeData?.aging_range_error_max);
        if (!template) {
            return this.errorMessage;
        }
        return template
            .replace("[INTERVAL]", titles[field] ?? '')
            .replace("[MIN]", String(min))
            .replace("[MAX]", String(max));
    }
}
