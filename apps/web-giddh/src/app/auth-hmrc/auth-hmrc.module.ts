import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthHMRCComponent } from './auth-hmrc.component';
import { AuthHMRCRoutingModule } from './auth-hmrc.routing.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';

@NgModule({
    declarations: [AuthHMRCComponent],
    imports: [
        CommonModule,
        AuthHMRCRoutingModule,
        GiddhPageLoaderModule
    ],
    exports: [ AuthHMRCComponent ],
})
export class AuthHMRCModule {
}
