import { NgModule } from '@angular/core';
import { GiddhNumberFormatPipe } from './number-format.pipe';

@NgModule({
    declarations: [GiddhNumberFormatPipe],
    exports: [GiddhNumberFormatPipe]
})
export class GiddhNumberFormatModule {

}
