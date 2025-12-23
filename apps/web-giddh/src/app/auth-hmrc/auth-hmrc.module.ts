import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthHMRCComponent } from './auth-hmrc.component';
import { AuthHMRCRoutingModule } from './auth-hmrc.routing.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';

@NgModule({
    declarations: [AuthHMRCComponent],
    imports: [
        CommonModule,
        AuthHMRCRoutingModule,
        GiddhPageLoaderModule,
        TranslateDirectiveModule
    ],
    exports: [ AuthHMRCComponent ],
})
export class AuthHMRCModule {
}
