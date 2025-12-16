import { NgModule } from '@angular/core';
import { AccountDetailModalComponent } from './account-detail-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateDirectiveModule } from '../translate/translate.directive.module';
// import { AsideMenuAccountModule } from '../../shared/aside-menu-account/aside.menu.account.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { GiddhPageLoaderModule } from '../../shared/giddh-page-loader/giddh-page-loader.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateDirectiveModule,
        // AsideMenuAccountModule,
        ClickOutsideModule,
        GiddhPageLoaderModule,
        MatDialogModule
    ],
    exports: [AccountDetailModalComponent],
    declarations: [AccountDetailModalComponent],
    providers: [],
})
export class AccountDetailModalModule {
}
