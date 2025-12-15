import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { RouterModule } from "@angular/router";
import { LaddaModule } from "angular2-ladda";
import { ConfirmModalModule } from "../../theme/confirm-modal/confirm-modal.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { DatepickerWrapperModule } from "../datepicker-wrapper/datepicker.wrapper.module";
import { ElementViewChildModule } from "../helpers/directives/elementViewChild/elementViewChild.module";
import { PrimarySidebarModule } from "../primary-sidebar/primary-sidebar.module";
import { AsideHelpSupportComponent } from "./components/aside-help-support/aside-help-support.component";
import { AsideSettingComponent } from "./components/aside-setting/aside-setting.component";
import { HeaderComponent } from "./header.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatMenuModule } from "@angular/material/menu";
import { ConnectPlaidComponent } from "../../theme/connect-plaid/connect-plaid.component";
import { ShareAccountModalComponent } from "./components/share-account-modal/share-account-modal.component";
import { ShareGroupModalComponent } from "./components/share-group-modal/share-group-modal.component";
import { ManageGroupsAccountsComponent } from "./components/new-manage-groups-accounts/manage-groups-accounts.component";
import { MasterExportOptionComponent } from "./components/master-export-option/master-export-option.component";
import { MasterComponent } from "./components/master/master.component";
import { GroupUpdateComponent } from "./components/group-update/group-update.component";
import { ExportGroupLedgerComponent } from "./components/group-export-ledger-modal/export-group-ledger.component";
import { GroupAddComponent } from "./components/group-add/group-add.component";
import { BulkAddDialogComponent } from "./components/bulk-add-dialog/bulk-add-dialog.component";
import { ExportMasterDialogComponent } from "./components/export-master-dialog/export-master-dialog.component";
import { CommandKModule } from "../../theme/command-k/command.k.module";
import { MatDividerModule } from "@angular/material/divider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatRadioModule } from "@angular/material/radio";
import { GenericAsideMenuAccountModule } from "../generic-aside-menu-account/generic.aside.menu.account.module";
import { TagsModule } from "../../settings/tags/tags.module";

@NgModule({
    declarations: [
        HeaderComponent,
        AsideSettingComponent,
        AsideHelpSupportComponent,
        ConnectPlaidComponent,
        ShareAccountModalComponent,
        ShareGroupModalComponent,
        ManageGroupsAccountsComponent,
        MasterExportOptionComponent,
        MasterComponent,
        GroupUpdateComponent,
        ExportGroupLedgerComponent,
        GroupAddComponent,
        BulkAddDialogComponent,
        ExportMasterDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        MatTooltipModule,
        ElementViewChildModule,
        ScrollingModule,
        PrimarySidebarModule,
        DatepickerWrapperModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ConfirmModalModule,
        RouterModule,
        MatDialogModule,
        MatListModule,
        MatButtonModule,
        MatTreeModule,
        MatMenuModule,
        CommandKModule,
        MatDividerModule,
        // GenericAsideMenuAccountModule, // Commented out due to NG6002 errors
        MatTooltipModule,
        MatSlideToggleModule,
        MatRadioModule,
        // TagsModule, // Commented out due to NG6002 errors
    ],
    exports: [
        HeaderComponent,
        AsideSettingComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HeaderModule {

}
