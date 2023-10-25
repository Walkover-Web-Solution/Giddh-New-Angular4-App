import { NgModule } from '@angular/core';
import { ServiceModule } from 'apps/web-giddh/src/app/services/service.module';
import { AccountNumberMaskPipe } from './accountNumberMask.pipe';

@NgModule({
    imports: [ServiceModule],
    exports: [AccountNumberMaskPipe],
    declarations: [AccountNumberMaskPipe],
    providers: []
})
export class AccountNumberMaskModule {

}
