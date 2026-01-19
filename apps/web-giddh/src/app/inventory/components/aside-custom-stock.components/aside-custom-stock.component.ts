import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'aside-custom-stock',
    templateUrl: './aside-custom-stock.component.html',
    standalone: false
})
/**
 * AsideCustomStockComponent component
 * Handles asidecustomstock functionality and user interactions
 */
export class AsideCustomStockComponent implements OnInit, OnDestroy {

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Stores the menu state */
    @Input() public menuState;

    public asideClose: boolean;
    public createCustomStockSuccess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>
    ) {
        this.createCustomStockSuccess$ = this.store.pipe(select(s => s.inventory.createCustomStockSuccess), takeUntil(this.destroyed$));
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.asideClose = false;
    }

    /**
     * Closes asidepane
     */
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
        this.asideClose = true;
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            this.asideClose = false;
        }, 500);
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
