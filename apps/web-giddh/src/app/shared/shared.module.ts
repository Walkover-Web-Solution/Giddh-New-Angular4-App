import { CommonModule, formatDate } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { DigitsOnlyModule } from 'apps/web-giddh/src/app/shared/helpers/directives/digitsOnly/digitsOnly.module';
import { HighlightModule } from 'apps/web-giddh/src/app/shared/helpers/pipes/highlightPipe/highlight.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { CKEditorModule } from 'ng2-ckeditor';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/lib/perfect-scrollbar.interfaces';

import { LedgerDiscountComponent } from '../../app/ledger/components/ledgerDiscount/ledgerDiscount.component';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';
import { ConfirmModalModule } from '../theme/confirm-modal';
import { SelectModule } from '../theme/ng-select/ng-select';
import {
    AuthServiceConfig,
    GoogleLoginProvider,
    LinkedinLoginProvider,
    SocialLoginModule,
} from '../theme/ng-social-login-module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { FormWizardModule } from '../theme/ng2-wizard';
import { UniversalListModule } from '../theme/universal-list/universal.list.module';
import { AsideMenuOtherTaxes } from './aside-menu-other-taxes/aside-menu-other-taxes';
import { FixedFooterComponent } from './fixed-footer/fixed-footer.component';
import { FooterComponent } from './footer/footer.component';
import {
    AccountsSideBarComponent,
    CompanyAddComponent,
    CompanyAddNewUiComponent,
} from './header/components';
import {
    AccountAddNewDetailsComponent,
} from './header/components/account-add-new-details/account-add-new-details.component';
import {
    AccountUpdateNewDetailsComponent,
} from './header/components/account-update-new-details/account-update-new-details.component';
import { GroupAddComponent } from './header/components/group-add/group-add.component';
import { GroupUpdateComponent } from './header/components/group-update/group-update.component';
import { ShareAccountModalComponent } from './header/components/share-account-modal/share-account-modal.component';
import { ShareGroupModalComponent } from './header/components/share-group-modal/share-group-modal.component';
import { AccountFilterPipe } from './header/pipe/accountfilter.pipe';
import { DecimalDigitsModule } from './helpers/directives/decimalDigits/decimalDigits.module';
import { DisableFormFieldModule } from './helpers/directives/disableFormField/disableFormField.module';
import { ElementViewChildModule } from './helpers/directives/elementViewChild/elementViewChild.module';
import { KeyboardShortutModule } from './helpers/directives/keyboardShortcut/keyboardShortut.module';
import { NgxMaskModule } from './helpers/directives/ngx-mask';
import { TextCaseChangeModule } from './helpers/directives/textCaseChange/textCaseChange.module';
import { OnBoardingComponent } from './on-boarding/on-boarding.component';
import { NgxDaterangepickerMd } from '../theme/ngx-date-range-picker';
import { DeleteTemplateConfirmationModelComponent } from '../invoice/templates/edit-template/modals/confirmation-modal/confirmation.modal.component';
import { ProformaAddBulkItemsComponent } from '../proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GiddhDatepickerComponent } from '../theme/giddh-datepicker/giddh-datepicker.component';
import { MatNativeDateModule, MAT_DATE_FORMATS, NativeDateAdapter, DateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { RevisionHistoryComponent } from './revision-history/revision-history.component';
import { PurchaseOrderPreviewModalComponent } from './purchase-order-preview/purchase-order-preview.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { PurchaseSendEmailModalComponent } from './purchase-send-email/purchase-send-email.component';
import { GiddhDaterangepickerComponent } from '../theme/giddh-daterangepicker/giddh-daterangepicker.component';
import { DatepickerWrapperModule } from './datepicker-wrapper/datepicker.wrapper.module';
import { AsideSettingModule } from './header/components/aside-setting/aside-setting.module';

// social login injection
// import {  } from 'ng-social-login-module/esm2015/lib/auth.module';

const getGoogleCredentials = () => {
    if (PRODUCTION_ENV || isElectron  || isCordova) {
        return {
            GOOGLE_CLIENT_ID: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com'
        };
    } else {
        return {
            GOOGLE_CLIENT_ID: '641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com'
        };
    }
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
const SOCIAL_CONFIG = (isElectron|| isCordova) ? null : new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        // provider: new GoogleLoginProvider('641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com')
        provider: new GoogleLoginProvider(getGoogleCredentials().GOOGLE_CLIENT_ID)
    },
    {
        id: LinkedinLoginProvider.PROVIDER_ID,
        provider: new LinkedinLoginProvider('817roify24ig8g')
    }
], false);

export function provideConfig() {
    return SOCIAL_CONFIG || { id: null, providers: [] };
}

export const GIDDH_DATEPICKER_FORMAT = {
    parse: { dateInput: 'dd-MM-yyyy' },
    display: {
        dateInput: 'input'
    }
};

export class PickDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            return formatDate(date, 'dd-MM-yyyy', this.locale);
        } else {
            return formatDate(date, 'MMM yyyy', this.locale);
        }
    }
}

@NgModule({
    declarations: [
        LedgerDiscountComponent,
        FooterComponent,
        FixedFooterComponent,
        AccountsSideBarComponent,
        CompanyAddComponent,
        CompanyAddNewUiComponent,
        AccountFilterPipe,
        OnBoardingComponent,
        GroupAddComponent,
        GroupUpdateComponent,
        ShareGroupModalComponent,
        ShareAccountModalComponent,
        AsideMenuOtherTaxes,
        AccountAddNewDetailsComponent,
        AccountUpdateNewDetailsComponent,
        ConfirmationModalComponent,
        DeleteTemplateConfirmationModelComponent,
        ProformaAddBulkItemsComponent,
        GiddhDatepickerComponent,
        RevisionHistoryComponent,
        PurchaseOrderPreviewModalComponent,
        PurchaseSendEmailModalComponent,
        GiddhDaterangepickerComponent
    ],
    imports: [
        KeyboardShortutModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        DatepickerModule,
        TypeaheadModule.forRoot(),
        UniversalListModule,
        TooltipModule,
        BsDropdownModule,
        PopoverModule.forRoot(),
        PerfectScrollbarModule,
        SocialLoginModule,
        FormWizardModule,
        SelectModule,
        ClickOutsideModule,
        ConfirmModalModule,
        LaddaModule,
        ElementViewChildModule,
        DisableFormFieldModule,
        ShSelectModule,
        DecimalDigitsModule,
        DigitsOnlyModule,
        BsDatepickerModule.forRoot(),
        PaginationModule,
        Daterangepicker,
        TextCaseChangeModule,
        HighlightModule,
        TabsModule,
        CKEditorModule,
        NgxMaskModule,
        NgxDaterangepickerMd.forRoot(),
        ScrollingModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatInputModule,
        PdfJsViewerModule,
        AsideSettingModule
    ],
    exports: [
        CommonModule,
        DatepickerModule,
        DecimalDigitsModule,
        PopoverModule,
        FormsModule,
        ReactiveFormsModule,
        LaddaModule,
        ShSelectModule,
        LedgerDiscountComponent,
        ModalModule,
        FooterComponent,
        FixedFooterComponent,
        ConfirmationModalComponent,
        AccountFilterPipe,
        SelectModule,
        PaginationModule,
        ClickOutsideModule,
        PerfectScrollbarModule,
        OnBoardingComponent,
        ConfirmModalModule,
        AccountsSideBarComponent,
        TextCaseChangeModule,
        KeyboardShortutModule,
        CompanyAddNewUiComponent,
        CKEditorModule,
        AsideMenuOtherTaxes,
        AccountAddNewDetailsComponent,
        AccountUpdateNewDetailsComponent,
        TabsModule,
        BsDropdownModule,
        ElementViewChildModule,
        TooltipModule,
        BsDatepickerModule,
        NgxDaterangepickerMd,
        DeleteTemplateConfirmationModelComponent,
        DatepickerWrapperModule,
        ProformaAddBulkItemsComponent,
        GiddhDatepickerComponent,
        RevisionHistoryComponent,
        PurchaseOrderPreviewModalComponent,
        PurchaseSendEmailModalComponent,
    ],
    entryComponents: [
        CompanyAddComponent,
        CompanyAddNewUiComponent,
        AccountAddNewDetailsComponent,
        OnBoardingComponent,
        AccountUpdateNewDetailsComponent
    ],
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        MatDatepickerModule,
        MatNativeDateModule,
        { provide: MAT_DATE_FORMATS, useValue: GIDDH_DATEPICKER_FORMAT },
        { provide: DateAdapter, useClass: PickDateAdapter },
    ]
})
export class SharedModule {
    public static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}
