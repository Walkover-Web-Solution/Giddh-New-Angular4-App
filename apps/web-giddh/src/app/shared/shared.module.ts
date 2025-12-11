import { CommonModule } from '@angular/common';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { DigitsOnlyModule } from 'apps/web-giddh/src/app/shared/helpers/directives/digitsOnly/digitsOnly.module';
import { HighlightModule } from 'apps/web-giddh/src/app/shared/helpers/pipes/highlightPipe/highlight.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { ScrollingModule } from '@angular/cdk/scrolling';

// COMMENTED OUT - MISSING MODULE IMPORTS
// import { CommandKModule } from '../theme/command-k/command.k.module';
// import { ConfirmModalModule } from '../theme/confirm-modal';
// import { AuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from '../theme/ng-social-login-module';
// import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
// import { NgxDaterangepickerMd } from '../theme/ngx-date-range-picker';
// import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
// import { ConfirmationModalModule } from '../theme/confirmation-modal/confirmation-modal.module';
// import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';

// COMMENTED OUT - MISSING COMPONENT IMPORTS
// import { ShareAccountModalComponent } from './header/components/share-account-modal/share-account-modal.component';
// import { ShareGroupModalComponent } from './header/components/share-group-modal/share-group-modal.component';
// import { GroupAddComponent } from './header/components/group-add/group-add.component';
// import { ExportGroupLedgerComponent } from './header/components/group-export-ledger-modal/export-group-ledger.component';
// import { GroupUpdateComponent } from './header/components/group-update/group-update.component';
// import { AccountOperationsComponent, ManageGroupsAccountsComponent } from './header/components';
// import { MasterComponent } from './header/components/master/master.component';
// import { AccountAddNewDetailsModule } from './header/components/account-add-new-details/account-add-new-details.module';
// import { AccountUpdateNewDetailsModule } from './header/components/account-update-new-details/account-update-new-details.module';
// import { ExportMasterDialogComponent } from './header/components/export-master-dialog/export-master-dialog.component';
// import { MasterExportOptionComponent } from './header/components/master-export-option/master-export-option.component';

@NgModule({
    declarations: [
        // Add component declarations here when components are available
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        LaddaModule,
        DigitsOnlyModule,
        HighlightModule,
        ClickOutsideModule,
        ScrollingModule
        // COMMENTED OUT - MISSING MODULES:
        // CommandKModule,
        // ConfirmModalModule,
        // SocialLoginModule,
        // Daterangepicker,
        // NgxDaterangepickerMd.forRoot(),
        // TranslateDirectiveModule,
        // ConfirmationModalModule,
        // GiddhDatepickerModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        LaddaModule,
        DigitsOnlyModule,
        HighlightModule,
        ClickOutsideModule,
        ScrollingModule
        // COMMENTED OUT - MISSING EXPORTS:
        // CommandKModule,
        // ConfirmModalModule,
        // NgxDaterangepickerMd,
        // TranslateDirectiveModule,
        // ConfirmationModalModule,
        // GiddhDatepickerModule
    ],
    providers: [
        // COMMENTED OUT - MISSING AUTH PROVIDER:
        // {
        //     provide: AuthServiceConfig,
        //     useFactory: (injector: Injector) => {
        //         const serviceConfig = injector.get(ServiceConfig) as IServiceConfigArgs;
        //         return new AuthServiceConfig([{
        //             id: GoogleLoginProvider.PROVIDER_ID,
        //             provider: new GoogleLoginProvider(serviceConfig?.GOOGLE_CLIENT_ID || '')
        //         }], false);
        //     },
        //     deps: [Injector]
        // }
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}