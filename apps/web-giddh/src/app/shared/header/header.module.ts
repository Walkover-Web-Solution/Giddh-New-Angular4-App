import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClickOutsideModule } from 'ng-click-outside';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/lib/perfect-scrollbar.interfaces';

import { CheckPermissionDirective } from '../../permissions/check-permission.directive';
import { CommandKModule } from '../../theme/command-k/command.k.module';
import { ConfirmModalModule } from '../../theme/confirm-modal';
import { DatepickerWrapperModule } from '../datepicker-wrapper/datepicker.wrapper.module';
import { ElementViewChildModule } from '../helpers/directives/elementViewChild/elementViewChild.module';
import { AsideHelpSupportComponent } from './components/aside-help-support/aside-help-support.component';
import { AsideSettingModule } from './components/aside-setting/aside-setting.module';
import { HeaderComponent } from './header.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    declarations: [
        AsideHelpSupportComponent,
        CheckPermissionDirective,
        HeaderComponent,
    ],
    exports: [
        HeaderComponent,
        RouterModule,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ModalModule,
        ElementViewChildModule,
        ConfirmModalModule,
        CommandKModule,
        PerfectScrollbarModule,
        TooltipModule,
        BsDropdownModule,
        AsideSettingModule,
        ClickOutsideModule,
        DatepickerWrapperModule
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
    ]
})
export class HeaderModule {

}