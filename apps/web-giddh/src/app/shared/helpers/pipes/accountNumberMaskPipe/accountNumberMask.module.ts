import { NgModule } from '@angular/core';
import { ServiceModule } from 'apps/web-giddh/src/app/services/service.module';
import { AccountNumberMaskPipe } from './accountNumberMask.pipe';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [ServiceModule],
    exports: [AccountNumberMaskPipe],
    declarations: [AccountNumberMaskPipe],
    providers: []
})
/**
 * AccountNumberMaskModule module
 * Implements AccountNumberMaskModule functionality
 */
export class AccountNumberMaskModule {

}
