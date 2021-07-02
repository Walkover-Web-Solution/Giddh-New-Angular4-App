import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { TaxSidebarComponent } from './tax-sidebar.component';

@NgModule({
    declarations: [TaxSidebarComponent],
    imports: [
        RouterModule,
        TranslateDirectiveModule,
        CommonModule
    ],
    exports: [TaxSidebarComponent]
})
export class TaxSidebarModule {
}
