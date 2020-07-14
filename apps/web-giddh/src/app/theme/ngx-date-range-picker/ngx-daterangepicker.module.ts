import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from '../../shared/helpers/directives/ngx-mask';
import { NgxDaterangepickerComponent } from './ngx-daterangepicker.component';
import { NgxDaterangepickerDirective } from './ngx-daterangepicker.directive';
import { LOCALE_CONFIG, LocaleConfig } from './ngx-daterangepicker.config';
import { NgxDaterangepickerLocaleService } from './ngx-daterangepicker-locale.service';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ScrollingModule } from '@angular/cdk/scrolling';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    suppressScrollY: true
};

@NgModule({
    declarations: [
        NgxDaterangepickerComponent,
        NgxDaterangepickerDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        PerfectScrollbarModule,
        ModalModule,
        ScrollingModule
    ],
    providers: [{
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }],
    exports: [
        NgxDaterangepickerComponent,
        NgxDaterangepickerDirective
    ],
    entryComponents: [
        NgxDaterangepickerComponent
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
