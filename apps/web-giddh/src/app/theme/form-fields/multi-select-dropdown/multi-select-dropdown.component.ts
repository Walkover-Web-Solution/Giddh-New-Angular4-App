import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, forwardRef, signal } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { fromEvent, merge, ReplaySubject, Subject, Subscription, timer } from "rxjs";
import { auditTime, debounceTime, distinctUntilChanged, map, switchMap, take, takeUntil } from "rxjs/operators";
import { IOption, SELECTED_ALL_OPTION } from "../../../app.constant";

@Component({
    selector: "multi-select-dropdown",
    templateUrl: "./multi-select-dropdown.component.html",
    styleUrls: ["./multi-select-dropdown.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiSelectDropdownComponent),
            multi: true
        }
    ],
    standalone: false
})
export class MultiSelectDropdownComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    /** Material select instance used to observe overlay-panel scrolling */
    @ViewChild(MatSelect) private matSelect: MatSelect;
    /** Field label shown above the select */
    @Input() public label: string = "";
    /** Search box placeholder */
    @Input() public placeholder: string = "";
    /** Full option list. Local search filtering is handled inside this component unless enableDynamicSearch is true. */
    @Input() public options: any[] = [];
    /** Property used as the option value. Defaults to IOption.value */
    @Input() public optionValue: string = "value";
    /** Property used as the option label. Defaults to IOption.label */
    @Input() public optionLabel: string = "label";
    /** When true, search is emitted to the parent instead of filtering locally */
    @Input() public enableDynamicSearch: boolean = false;
    /** Name attribute for the inner select */
    @Input() public name: string = "";
    /** True if field is required */
    @Input() public required: boolean = false;
    /** True if field is disabled */
    @Input() public disabled: boolean = false;
    /** Mat form field appearance */
    @Input() public appearance: "legacy" | "outline" | "fill" = "outline";
    /** Extra CSS class on the form field */
    @Input() public cssClass: string = "w-100";
    /** True to show the Material invalid/error state on the form field */
    @Input() public showError: boolean = false;
    /** Overlay panel class */
    @Input() public panelClass: string = "";
    /** Label shown when search has no matches */
    @Input() public noEntriesFoundLabel: string = "";
    /** When true, shows an All option that selects every item and writes [SELECTED_ALL_OPTION] */
    @Input() public showAllOption: boolean = false;
    /** Custom label for the All option */
    @Input() public allOptionLabel: string = "";
    /** Emits the committed control value after a user selection */
    @Output() public selectionChange: EventEmitter<Array<string | number>> = new EventEmitter<Array<string | number>>();
    /** Emits the search text when enableDynamicSearch is true */
    @Output() public dynamicSearchedQuery: EventEmitter<string> = new EventEmitter<string>();
    /** Emits when the options panel is scrolled near its end */
    @Output() public scrollEnd: EventEmitter<void> = new EventEmitter<void>();
    /** Sentinel written when All is selected */
    public readonly allOptionValue: string = SELECTED_ALL_OPTION;
    /** Search control used by ngx-mat-select-search */
    public searchControl: FormControl<string | null> = new FormControl<string | null>("");
    /** Options currently visible in the panel */
    public filteredOptions = signal<IOption[]>([]);
    /** True when the search box has a non-empty term (hides the All option) */
    public isSearching = signal<boolean>(false);
    /** Whether the All option is active */
    public isAllSelected = signal<boolean>(false);
    /** Values bound to mat-select (includes every option value when All is active) */
    public uiSelectedValues: Array<string | number> = [];
    /** Common locale strings from appTranslate */
    public commonLocaleData: any = {};
    /** Value written to the parent form control */
    private controlValue: Array<string | number> = [];
    /** Emits on each option click; inner timer is reset by switchMap */
    private parentValueChange$: Subject<void> = new Subject<void>();
    /** Emits when the panel closes so a pending parent notify is flushed immediately */
    private flushParentValue$: Subject<void> = new Subject<void>();
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Active subscription to the material select overlay scroll */
    private panelScrollSubscription?: Subscription;
    /** Tracks whether the overlay is still open while its element becomes available */
    private isPanelOpen: boolean = false;
    /** Function to be called when the control value changes */
    private onChange: (value: Array<string | number>) => void = () => { };
    /** Function to be called when the control is touched */
    private onTouched: () => void = () => { };

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    /**
     * Initializes search filtering
     *
     * @memberof MultiSelectDropdownComponent
     */
    public ngOnInit(): void {
        this.setVisibleOptions(this.searchControl.value, true);
        this.parentValueChange$.pipe(
            switchMap(() => merge(timer(500), this.flushParentValue$).pipe(
                take(1),
                map(() => this.controlValue)
            )),
            takeUntil(this.destroyed$)
        ).subscribe((value: Array<string | number>) => {
            this.notifyParent(value);
        });
        this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe((search: string) => {
            this.setVisibleOptions(search);
        });
    }

    /**
     * Re-filters and re-syncs UI when options or All-option flag change
     *
     * @param {SimpleChanges} changes
     * @memberof MultiSelectDropdownComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.options || changes.optionValue || changes.optionLabel) {
            this.setVisibleOptions(this.searchControl.value, true);
            this.syncUiFromControl();
        }
        if (changes.showAllOption && !changes.showAllOption.firstChange) {
            this.syncUiFromControl();
        }
        if (changes.showError || changes.label || changes.placeholder || changes.allOptionLabel) {
            this.changeDetectorRef.markForCheck();
        }
    }

    /**
     * Writes the parent form / ngModel value into the dropdown
     *
     * @param {Array<string | number>} value
     * @memberof MultiSelectDropdownComponent
     */
    public writeValue(value: Array<string | number>): void {
        this.controlValue = Array.isArray(value) ? [...value] : [];
        this.isAllSelected.set(this.showAllOption && this.isAllSentinel(this.controlValue));
        this.syncUiFromControl();
    }

    /**
     * Registers change callback
     *
     * @param {*} fn
     * @memberof MultiSelectDropdownComponent
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Registers touched callback
     *
     * @param {*} fn
     * @memberof MultiSelectDropdownComponent
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Disables the select from a parent form control
     *
     * @param {boolean} isDisabled
     * @memberof MultiSelectDropdownComponent
     */
    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Handles mat-select selection. All-option logic stays inside the component.
     *
     * @param {Array<string | number>} selected
     * @memberof MultiSelectDropdownComponent
     */
    public onSelectionChange(selected: Array<string | number>): void {
        const next = selected ?? [];
        if (!this.showAllOption) {
            this.uiSelectedValues = next;
            this.commitValue(next);
            return;
        }
        this.handleAllOptionSelection(next);
    }

    /**
     * Resets search when the panel closes with no matches, and marks the control touched
     *
     * @memberof MultiSelectDropdownComponent
     */
    public onClosed(): void {
        this.isPanelOpen = false;
        this.panelScrollSubscription?.unsubscribe();
        this.panelScrollSubscription = undefined;
        this.flushParentValueChange();
        if (!this.filteredOptions()?.length) {
            this.searchControl.reset();
        }
        this.onTouched();
    }

    /**
     * Refreshes labels after common locale strings load
     *
     * @memberof MultiSelectDropdownComponent
     */
    public onTranslationComplete(): void {
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Starts observing the overlay panel when the select opens.
     *
     * @param {boolean} isOpen Whether the select panel is open
     * @memberof MultiSelectDropdownComponent
     */
    public onOpenedChange(isOpen: boolean): void {
        this.isPanelOpen = isOpen;
        this.panelScrollSubscription?.unsubscribe();
        this.panelScrollSubscription = undefined;
        if (!isOpen) {
            return;
        }
        setTimeout(() => {
            const panel = this.matSelect?.panel?.nativeElement;
            if (!this.isPanelOpen || !panel) {
                return;
            }
            this.panelScrollSubscription = fromEvent(panel, "scroll").pipe(
                auditTime(100),
                takeUntil(this.destroyed$)
            ).subscribe(() => {
                const reachedEnd = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 32;
                if (reachedEnd) {
                    this.scrollEnd.emit();
                }
            });
        });
    }

    /**
     * Releases subscriptions
     *
     * @memberof MultiSelectDropdownComponent
     */
    public ngOnDestroy(): void {
        this.panelScrollSubscription?.unsubscribe();
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.parentValueChange$.complete();
        this.flushParentValue$.complete();
    }

    /**
     * Updates visible options. Local filter is skipped when the parent owns search (dynamic/API).
     *
     * @private
     * @param {string} search
     * @param {boolean} [skipEmit] True when options changed from the parent, so search is not re-emitted
     * @memberof MultiSelectDropdownComponent
     */
    private setVisibleOptions(search: string, skipEmit: boolean = false): void {
        const options = this.getOptionList();
        const term = (search ?? "").trim();
        this.isSearching.set(!!term);
        if (this.enableDynamicSearch) {
            if (!skipEmit) {
                this.dynamicSearchedQuery.emit(search ?? "");
            }
            this.filteredOptions.set(options);
        } else {
            const query = term.toLowerCase();
            this.filteredOptions.set(query ? options.filter(option => option?.label?.toLowerCase()?.includes(query)) : options);
        }
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Maps All-option clicks to [SELECTED_ALL_OPTION] for the parent, while keeping every item checked in the UI.
     *
     * @private
     * @param {Array<string | number>} selected
     * @memberof MultiSelectDropdownComponent
     */
    private handleAllOptionSelection(selected: Array<string | number>): void {
        const allValues = this.getAllOptionValues();
        const hadAll = this.isAllSelected();
        const hasAllNow = selected.includes(this.allOptionValue);
        const realSelections = selected.filter(value => value !== this.allOptionValue);

        if (hasAllNow && !hadAll) {
            this.isAllSelected.set(true);
            this.uiSelectedValues = [this.allOptionValue, ...allValues];
            this.commitValue([this.allOptionValue]);
            return;
        }

        if (!hasAllNow && hadAll) {
            this.isAllSelected.set(false);
            if (selected.length === allValues.length) {
                this.uiSelectedValues = [];
                this.commitValue([]);
            } else {
                this.uiSelectedValues = realSelections;
                this.commitValue(realSelections);
            }
            return;
        }

        const allSelected = allValues.length > 0 && allValues.every(value => realSelections.includes(value));
        this.isAllSelected.set(allSelected);
        if (allSelected) {
            this.uiSelectedValues = [this.allOptionValue, ...allValues];
            this.commitValue([this.allOptionValue]);
        } else {
            this.uiSelectedValues = realSelections;
            this.commitValue(realSelections);
        }
    }

    /**
     * Syncs mat-select checked state from the control value without emitting
     *
     * @private
     * @memberof MultiSelectDropdownComponent
     */
    private syncUiFromControl(): void {
        if (this.isAllSelected()) {
            this.uiSelectedValues = [this.allOptionValue, ...this.getAllOptionValues()];
        } else {
            this.uiSelectedValues = [...this.controlValue];
        }
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Updates the local value immediately and notifies the parent after 400ms of idle selection.
     *
     * @private
     * @param {Array<string | number>} value
     * @memberof MultiSelectDropdownComponent
     */
    private commitValue(value: Array<string | number>): void {
        this.controlValue = [...value];
        this.parentValueChange$.next();
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Writes the current value to the parent form and selectionChange output.
     *
     * @private
     * @param {Array<string | number>} value
     * @memberof MultiSelectDropdownComponent
     */
    private notifyParent(value: Array<string | number>): void {
        this.onChange(value);
        this.selectionChange.emit(value);
    }

    /**
     * Completes the pending debounce immediately when the panel closes.
     *
     * @private
     * @memberof MultiSelectDropdownComponent
     */
    private flushParentValueChange(): void {
        this.flushParentValue$.next();
    }

    /**
     * Returns true when the control value is exactly [SELECTED_ALL_OPTION]
     *
     * @private
     * @param {Array<string | number>} value
     * @returns {boolean}
     * @memberof MultiSelectDropdownComponent
     */
    private isAllSentinel(value: Array<string | number>): boolean {
        return value?.length === 1 && value[0] === this.allOptionValue;
    }

    /**
     * Normalizes parent options to IOption and drops the All sentinel if it was passed in
     *
     * @private
     * @returns {IOption[]}
     * @memberof MultiSelectDropdownComponent
     */
    private getOptionList(): IOption[] {
        return (this.options ?? [])
            .map(option => this.normalizeOption(option))
            .filter(option => option && option.value !== this.allOptionValue);
    }

    /**
     * Maps a raw option object onto IOption using optionValue / optionLabel
     *
     * @private
     * @param {*} option
     * @returns {IOption}
     * @memberof MultiSelectDropdownComponent
     */
    private normalizeOption(option: any): IOption {
        if (!option) {
            return null;
        }
        const value = option[this.optionValue];
        if (value === undefined || value === null) {
            return null;
        }
        return {
            value,
            label: option[this.optionLabel] ?? String(value),
            disabled: option.disabled,
            additional: option
        };
    }

    /**
     * All real option values used to check every item when All is selected
     *
     * @private
     * @returns {Array<string | number>}
     * @memberof MultiSelectDropdownComponent
     */
    private getAllOptionValues(): Array<string | number> {
        return this.getOptionList().map(option => option.value);
    }
}
