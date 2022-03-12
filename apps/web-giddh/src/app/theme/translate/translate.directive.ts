import { Directive, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { LocaleService } from '../../services/locale.service';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Directive({
    selector: '[appTranslate]'
})

export class TranslateDirective implements OnInit, OnDestroy {
    /* Taking input the file name */
    @Input() file: string;
    /* This will make sure if required common data */
    @Input() requireCommonData: boolean = true;

    /* This will emit local JSON data */
    @Output() public localeData: EventEmitter<any> = new EventEmitter();
    /* This will emit common JSON data */
    @Output() public commonLocaleData: EventEmitter<any> = new EventEmitter();
    /* This will emit if response is complete  */
    @Output() public translationComplete: EventEmitter<boolean> = new EventEmitter();
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /* Initializing the current language */
    private currentLanguage: string = "";

    constructor(private localeService: LocaleService, private store: Store<AppState>) {
        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            this.currentLanguage = response?.value;
            this.localeService.language = response?.value;
        });
    }

    /**
     * Initializes the directive
     *
     * @memberof TranslateDirective
     */
    public ngOnInit(): void {
        this.getLocale();
    }

    /**
     * This will get the locale JSON
     *
     * @param {string} language
     * @memberof TranslateDirective
     */
    public getLocale(): void {
        if (this.file && this.currentLanguage) {
            this.localeService.getLocale(this.file, this.currentLanguage).subscribe(response => {
                this.localeData.emit(response);
                this.translationComplete.emit(true);
            });
        }

        if (this.requireCommonData) {
            this.store.pipe(select(state => state.session.commonLocaleData), takeUntil(this.destroyed$)).subscribe((response) => {
                if (response) {
                    this.commonLocaleData.emit(response);
                    if (!this.file) {
                        this.translationComplete.emit(true);
                    }
                }
            });
        }
    }

    /**
     * Unsubscribes from the listeners
     *
     * @memberof TranslateDirective
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
