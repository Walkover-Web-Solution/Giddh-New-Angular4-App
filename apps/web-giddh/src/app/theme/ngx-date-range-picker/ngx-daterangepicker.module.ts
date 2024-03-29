import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from '../../shared/helpers/directives/ngx-mask';
import { NgxDaterangepickerComponent } from './ngx-daterangepicker.component';
import { NgxDaterangepickerDirective } from './ngx-daterangepicker.directive';
import { LOCALE_CONFIG, LocaleConfig } from './ngx-daterangepicker.config';
import { NgxDaterangepickerLocaleService } from './ngx-daterangepicker-locale.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateDirectiveModule } from '../translate/translate.directive.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CdkScrollModule } from '../form-fields/cdk-scroll/cdk-scroll.module';


@NgModule({
    declarations: [
        NgxDaterangepickerComponent,
        NgxDaterangepickerDirective
    ],
    exports: [
        NgxDaterangepickerComponent,
        NgxDaterangepickerDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        ModalModule.forRoot(),
        TranslateDirectiveModule,
        MatButtonModule,
        MatInputModule,
        CdkScrollModule
    ]
})

export class NgxDaterangepickerMd {
    constructor() {
    }

    static forRoot(config: LocaleConfig = {}): ModuleWithProviders<NgxDaterangepickerMd> {
        return {
            ngModule: NgxDaterangepickerMd,
            providers: [
                { provide: LOCALE_CONFIG, useValue: config },
                { provide: NgxDaterangepickerLocaleService, useClass: NgxDaterangepickerLocaleService, deps: [LOCALE_CONFIG] }
            ]
        };
    }
}
