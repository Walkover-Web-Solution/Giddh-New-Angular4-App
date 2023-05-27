import { CommonModule, TitleCasePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { SalesShSelectModule } from "../theme/sales-ng-virtual-select/sh-select.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GiddhDatepickerModule } from "../theme/giddh-datepicker/giddh-datepicker.module";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { NgxUploaderModule } from "ngx-uploader";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { AmountFieldComponentModule } from "../shared/amount-field/amount-field.module";
import { DecimalDigitsModule } from "../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { NgxMaskModule } from "../shared/helpers/directives/ngx-mask";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { KeyboardShortutModule } from "../shared/helpers/directives/keyboardShortcut/keyboardShortut.module";
import { SharedModule } from "../shared/shared.module";
import { TaxControlModule } from "../theme/tax-control/tax-control.module";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { PrintComponent } from "./components/print/print.component";
import { MainComponent } from "./main.component";
import { PaymentReceiptComponent } from "./components/create-edit/payment-receipt.component";
import { PaymentReceiptRoutingModule } from "./payment-receipt.routing.module";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { SendEmailModule } from "../shared/send-email/send-email.module";
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { AsideMenuOtherTaxesModule } from "../shared/aside-menu-other-taxes/aside-menu-other-taxes.module";
import { MatLegacySlideToggleModule as MatSlideToggleModule } from "@angular/material/legacy-slide-toggle";
import { AdvanceReceiptAdjustmentModule } from "../shared/advance-receipt-adjustment/advance-receipt-adjustment.module";

@NgModule({
    declarations: [
        MainComponent,
        PaymentReceiptComponent,
        PrintComponent
    ],
    imports: [
        PaymentReceiptRoutingModule,
        CommonModule,
        MatCardModule,
        FormFieldsModule,
        MatButtonModule,
        SalesShSelectModule,
        FormsModule,
        GiddhDatepickerModule,
        MatSelectModule,
        MatInputModule,
        NgxUploaderModule,
        MatCheckboxModule,
        MatMenuModule,
        AmountFieldComponentModule,
        ReactiveFormsModule,
        DecimalDigitsModule,
        NgxMaskModule.forRoot(),
        TranslateDirectiveModule,
        KeyboardShortutModule,
        SharedModule,
        TaxControlModule,
        SendEmailModule,
        MatDialogModule,
        GiddhPageLoaderModule,
        MatAutocompleteModule,
        AsideMenuOtherTaxesModule,
        MatSlideToggleModule,
        MatTooltipModule,
        AdvanceReceiptAdjustmentModule
    ],
    providers: [TitleCasePipe]
})

export class PaymentReceiptModule {

}