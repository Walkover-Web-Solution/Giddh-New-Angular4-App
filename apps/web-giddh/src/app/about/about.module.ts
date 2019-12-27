import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AboutRoutingModule } from './about.routing.module';
import { AboutComponent } from './about.component';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        AboutComponent,
    ],
    exports: [AboutComponent],
    imports: [
        CommonModule,
        FormsModule,
        AboutRoutingModule
    ],
})
export class AboutModule {
}
