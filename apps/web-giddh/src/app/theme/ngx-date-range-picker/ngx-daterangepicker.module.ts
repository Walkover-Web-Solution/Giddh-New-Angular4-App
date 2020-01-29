import { CommonModule } from '@angular/common';
import {  ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { NgxMaskModule } from '../../shared/helpers/directives/ngx-mask';
import { NgxDaterangepickerComponent } from './ngx-daterangepicker.component';
import { NgxDaterangepickerDirective } from './ngx-daterangepicker.directive';
import { DefaultLocaleConfig, LocaleConfig } from './ngx-daterangepicker.config';

@NgModule({
  declarations: [
    NgxDaterangepickerComponent,
    NgxDaterangepickerDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ],
  providers: [],
  exports: [
    NgxDaterangepickerComponent,
    NgxDaterangepickerDirective
  ],
  entryComponents: [
    NgxDaterangepickerComponent
  ]
})
export class NgxDaterangepickerMd {
  constructor(@Optional() @SkipSelf() parentModule: NgxDaterangepickerMd) {
    if (parentModule) {
      throw new Error('NgxDaterangepickerMd is already loaded. Import it in the root module only');
    }
  }
  static forRoot(config: LocaleConfig = DefaultLocaleConfig): ModuleWithProviders {
    return {
      ngModule: NgxDaterangepickerMd,
      providers: [
        {provide: LocaleConfig, useValue: {...DefaultLocaleConfig, ...config}}
      ]
    };
  }
}
