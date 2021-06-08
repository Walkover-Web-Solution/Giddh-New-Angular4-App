import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GstrSidebarComponent } from './gst-sidebar.component';

@NgModule({
    declarations: [GstrSidebarComponent],
    imports: [
        RouterModule,
        TranslateDirectiveModule
    ],
    exports: [GstrSidebarComponent]
})
export class GstrSidebarModule {
}
