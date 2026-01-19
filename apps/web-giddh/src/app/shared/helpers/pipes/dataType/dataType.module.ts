import { NgModule } from '@angular/core';
import { ServiceModule } from 'apps/web-giddh/src/app/services/service.module';
import { DataTypePipe } from './dataType.pipe';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [ServiceModule],
    exports: [DataTypePipe],
    declarations: [DataTypePipe],
    providers: []
})
/**
 * DataTypeModule module
 * Implements DataTypeModule functionality
 */
export class DataTypeModule {

}
