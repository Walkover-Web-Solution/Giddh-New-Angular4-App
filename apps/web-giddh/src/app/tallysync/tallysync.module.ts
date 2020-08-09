import {NgModule} from '@angular/core';
import {TallysyncRoutingModule} from './tallysync.routing.module';
import {DigitsOnlyModule} from '../shared/helpers/directives/digitsOnly/digitsOnly.module';

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
