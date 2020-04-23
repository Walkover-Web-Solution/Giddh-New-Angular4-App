import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from '../../shared/helpers/directives/ngx-mask';
import { NgxDaterangepickerComponent } from './ngx-daterangepicker.component';
import { NgxDaterangepickerDirective } from './ngx-daterangepicker.directive';
import { LOCALE_CONFIG, LocaleConfig } from './ngx-daterangepicker.config';
import { NgxDaterangepickerLocaleService } from './ngx-daterangepicker-locale.service';
import { ScrollComponent } from './virtual-scroll';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    suppressScrollY: true
};

@NgModule({
    declarations: [
        NgxDaterangepickerComponent,
        NgxDaterangepickerDirective,
        ScrollComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        PerfectScrollbarModule
    ],
    providers: [{
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }],
    exports: [
        NgxDaterangepickerComponent,
        NgxDaterangepickerDirective,
        ScrollComponent
    ],
    entryComponents: [
        NgxDaterangepickerComponent,
        ScrollComponent
    ]
})

export class NgxDaterangepickerMd {
    constructor() {
    }

    static forRoot(config: LocaleConfig = {}): ModuleWithProviders {
        return {
            ngModule: NgxDaterangepickerMd,
            providers: [
                {provide: LOCALE_CONFIG, useValue: config},
                {provide: NgxDaterangepickerLocaleService, useClass: NgxDaterangepickerLocaleService, deps: [LOCALE_CONFIG]}
            ]
        };
    }
}
