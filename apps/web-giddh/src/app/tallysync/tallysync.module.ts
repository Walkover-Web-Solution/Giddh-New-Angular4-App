import { NgModule } from '@angular/core';

import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { TallysyncRoutingModule } from './tallysync.routing.module';

@NgModule({
    declarations: [],
    imports: [
        TallysyncRoutingModule,
        DigitsOnlyModule
    ],
    exports: [
        TallysyncRoutingModule
    ]
})
export class TallysyncModule {
}
