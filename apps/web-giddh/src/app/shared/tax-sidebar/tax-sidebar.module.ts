import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { TaxSidebarComponent } from './tax-sidebar.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
    declarations: [TaxSidebarComponent],
    imports: [
        RouterModule,
        TranslateDirectiveModule,
        CommonModule,
        MatListModule
    ],
    exports: [TaxSidebarComponent]
})
export class TaxSidebarModule {
}
