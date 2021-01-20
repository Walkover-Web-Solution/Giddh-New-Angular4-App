import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ConfirmModalModule } from 'apps/web-giddh/src/app/theme/confirm-modal/confirm-modal.module';
import { ShSelectModule } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KeyboardShortutModule } from '../../../helpers/directives/keyboardShortcut/keyboardShortut.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AccountOperationsComponent } from '../account-operations/account-operations.component';
import { ExportGroupLedgerComponent } from '../group-export-ledger-modal/export-group-ledger.component';
import { GroupsAccountSidebarComponent } from '../new-group-account-sidebar/groups-account-sidebar.component';
import { ManageGroupsAccountsComponent } from './manage-groups-accounts.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    declarations: [
        ManageGroupsAccountsComponent,
        AccountOperationsComponent,
        GroupsAccountSidebarComponent,
        ExportGroupLedgerComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TabsModule,
        PerfectScrollbarModule,
        ReactiveFormsModule,
        ShSelectModule,
        LaddaModule,
        ModalModule,
        ConfirmModalModule,
        ScrollingModule,
        KeyboardShortutModule,
        TooltipModule
    ],
    exports: [
        ManageGroupsAccountsComponent,
        AccountOperationsComponent,
        GroupsAccountSidebarComponent,
        ExportGroupLedgerComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})
export class ManageGroupsAccountModule {}