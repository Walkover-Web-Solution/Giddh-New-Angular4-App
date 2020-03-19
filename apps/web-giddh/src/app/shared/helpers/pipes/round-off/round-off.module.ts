import { NgModule } from '@angular/core';

import { GiddhRoundOffPipe } from './round-off.pipe';

@NgModule({
    declarations: [GiddhRoundOffPipe],
    exports: [GiddhRoundOffPipe]
})
export class GiddhRoundOffPipeModule { }
