import { Directive, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LocaleService } from '../../services/locale.service';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Directive({
    selector: '[appTranslate]'
})

export class TranslateDirective implements OnInit {
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

    /* Initializing the current language */
    private currentLanguage: string = "en";

    constructor(private localeService: LocaleService, private store: Store<AppState>) {
        
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
        if(this.file && this.currentLanguage) {
            this.localeService.getLocale(this.file, this.currentLanguage).subscribe(response => {
                this.localeData.emit(response);
                this.translationComplete.emit(true);
            });
        }

        if(this.requireCommonData) {
            this.store.pipe(select(state => state.session.commonLocaleData), take(1)).subscribe((response) => {
                this.commonLocaleData.emit(response);
            });
        }
    }
}