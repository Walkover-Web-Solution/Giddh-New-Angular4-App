import { NgModule } from '@angular/core';
import { ServiceModule } from 'apps/web-giddh/src/app/services/service.module';
import { DataTypePipe } from './dataType.pipe';

@NgModule({
    imports: [ServiceModule],
    exports: [DataTypePipe],
    declarations: [DataTypePipe],
    providers: []
})
export class DataTypeModule {

}
