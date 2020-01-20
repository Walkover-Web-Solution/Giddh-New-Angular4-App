import { NgModule } from '@angular/core';
import { TallysyncRoutingModule } from './tallysync.routing.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';

@NgModule({
    declarations: [],
    imports: [
        TallysyncRoutingModule,
        NgbTypeaheadModule.forRoot(),
        DigitsOnlyModule
    ],
    exports: [
        TallysyncRoutingModule
    ]
})
export class TallysyncModule {
}
