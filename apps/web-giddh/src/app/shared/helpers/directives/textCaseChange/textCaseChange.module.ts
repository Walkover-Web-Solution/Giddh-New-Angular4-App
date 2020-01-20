import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TextCaseChangeDirective } from './textCaseChange.directive';

@NgModule({
    imports: [],
    declarations: [
        TextCaseChangeDirective
    ],
    exports: [
        TextCaseChangeDirective
    ]
})
export class TextCaseChangeModule {
    //
}
