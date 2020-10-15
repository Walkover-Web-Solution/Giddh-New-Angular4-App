import { Directive, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { LocaleService } from '../../services/locale.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appTranslate]'
})
export class TranslateDirective implements OnInit, OnDestroy {
    /* Taking input the file name */
    @Input() file: string;

    /* This will emit local JSON data */
    @Output() public localeData: EventEmitter<any> = new EventEmitter();
    /* This will emit common JSON data */
    @Output() public commonLocaleData: EventEmitter<any> = new EventEmitter();

    /* Initializing the current language */
    private currentLanguage: string = "en";

    /** Subject to unsubscribe from all listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private localeService: LocaleService) {
        
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
     * This will release the memory
     *
     * @memberof TranslateDirective
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will get the locale JSON
     *
     * @param {string} language
     * @memberof TranslateDirective
     */
    public getLocale(): void {
        if(this.file && this.currentLanguage) {
            this.localeService.getLocale(this.file, this.currentLanguage).subscribe(response => {
                this.localeData.emit(response);
            });
        }

        this.localeService.commonData.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.commonLocaleData.emit(response);
        });
    }
}