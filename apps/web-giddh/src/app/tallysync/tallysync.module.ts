import { NgModule } from '@angular/core';
import { TallysyncRoutingModule } from './tallysync.routing.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module'

@NgModule({
    declarations: [],
    imports: [
        TallysyncRoutingModule,
        NgbTypeaheadModule.forRoot(),
        DigitsOnlyModule,
        SharedModule
    ],
    exports: [
        TallysyncRoutingModule
    ]
})
export class TallysyncModule {
}
