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

/**
 * Aging range option payload used across the app.
 * Mirrors the shape of `AgingDropDownoptions` (fourth/fifth/sixth) so it can be
 * consumed by the contact aging report as well as the stock aging report.
 */
export interface AgeRangeEditorOptions {
    /** Upper bound of the first interval (e.g. 30 for "0-30") */
    fourth: number;
    /** Upper bound of the second interval (e.g. 60 for "31-60") */
    fifth: number;
    /** Upper bound of the third interval (e.g. 90 for "61-90") */
    sixth: number;
}

/**
 * Presentational (dumb) popup that lets the user edit ONE aging interval
 * (First / Second / Third / Last) at a time using From / To inputs.
 *
 * - Holds no store / no side-effects. Emits `save` with the new options only
 *   when the values are valid, and `close` when the popup should be dismissed.
 * - Auto-focuses the first editable input so users can type and press Enter
 *   to save + close.
 */
@Component({
    selector: 'age-range-editor',
    templateUrl: './age-range-editor.component.html',
    styleUrls: ['./age-range-editor.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ClickOutsideModule, FormFieldsModule],
})
export class AgeRangeEditorComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    /** Current interval boundaries. Cloned internally to keep the input pure. */
    @Input() public options: AgeRangeEditorOptions = { fourth: 0, fifth: 0, sixth: 0 };
    /** Index of the interval currently being edited (0=first, 1=second, 2=third, 3=last) */
    @Input() public activeInterval: number = 0;
    /** Locale keys for interval titles ({ first_interval, second_interval, third_interval, last_interval }) */
    @Input() public localeData: any = {};
    /** Optional error message displayed when values violate the ascending rule */
    @Input() public errorMessage: string = 'Ranges must be in ascending order';
    /**
     * Value forwarded to the due-days-range API as `vendorCustomerType`.
     * Callers pass 'customer' / 'vendor' for contact aging, 'inventory' for
     * stock aging, etc. When set, the editor dispatches `CreateDueRange`
     * itself on save so the parent doesn't have to.
     */
    @Input() public vendorCustomerType: string = '';

    /** Emitted with the validated, cloned options when the user saves. */
    @Output() public save: EventEmitter<AgeRangeEditorOptions> = new EventEmitter<AgeRangeEditorOptions>();
    /** Emitted when the popup should be dismissed (click outside / Enter). */
    @Output() public close: EventEmitter<void> = new EventEmitter<void>();

    /** Local, editable copy of the options so we don't mutate the parent input directly. */
    public model: AgeRangeEditorOptions = { fourth: 0, fifth: 0, sixth: 0 };
    /** True when local model values are in a valid ascending order. */
    public isValid: boolean = true;
    /** True once the user has changed any value; controls whether we emit save on close. */
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
            this.model = {
                fourth: Number(this.options.fourth) || 0,
                fifth: Number(this.options.fifth) || 0,
                sixth: Number(this.options.sixth) || 0,
            };
            this.dirty = false;
            this.isValid = this.validate();
        }
    }

    /**
     * Auto-focus the first editable input (the "To" field) once the popup renders.
     */
    public ngAfterViewInit(): void {
        setTimeout(() => {
            const host = this.elementRef?.nativeElement as HTMLElement;
            const target = host?.querySelector<HTMLInputElement>('.range-input:not([disabled])');
            if (target) {
                target.focus({ preventScroll: true });
            }
        }, 0);
    }

    /**
     * Called after each edit of a `To` input. Validates the ascending
     * constraint and marks the model dirty so `close` will emit `save`.
     */
    public onValueChange(): void {
        this.model.fourth = Number(this.model.fourth);
        this.model.fifth = Number(this.model.fifth);
        this.model.sixth = Number(this.model.sixth);
        this.dirty = true;
        this.isValid = this.validate();
    }

    /**
     * Handles the "outside click" that dismisses the popup.
     * Emits `save` first (if the user edited valid values), then `close`.
     */
    public onClickOutside(_event?: any): void {
        if (this.dirty && this.isValid) {
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
        } else {
            this.close.emit();
        }
    }

    /**
     * Validate that fourth < fifth < sixth. Used to gate the save emission.
     */
    private validate(): boolean {
        const { fourth, fifth, sixth } = this.model;
        if (fourth >= (fifth || sixth)) {
            return false;
        }
        if (fifth <= fourth || fifth >= sixth) {
            return false;
        }
        if (sixth <= (fourth || fifth)) {
            return false;
        }
        return true;
    }
}
