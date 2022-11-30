import { CommonModule, TitleCasePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCardModule } from '@angular/material/card';
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { MatButtonModule } from "@angular/material/button";
import { SalesShSelectModule } from "../theme/sales-ng-virtual-select/sh-select.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GiddhDatepickerModule } from "../theme/giddh-datepicker/giddh-datepicker.module";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { NgxUploaderModule } from "ngx-uploader";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatMenuModule } from "@angular/material/menu";
import { AmountFieldComponentModule } from "../shared/amount-field/amount-field.module";
import { DecimalDigitsModule } from "../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { NgxMaskModule } from "../shared/helpers/directives/ngx-mask";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { KeyboardShortutModule } from "../shared/helpers/directives/keyboardShortcut/keyboardShortut.module";
import { SharedModule } from "../shared/shared.module";
import { TaxControlModule } from "../theme/tax-control/tax-control.module";
import { MatDialogModule } from "@angular/material/dialog";
import { PrintComponent } from "./components/print/print.component";
import { MainComponent } from "./main.component";
import { PaymentReceiptComponent } from "./components/create-edit/payment-receipt.component";
import { PaymentReceiptRoutingModule } from "./payment-receipt.routing.module";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { SendEmailModule } from "../shared/send-email/send-email.module";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from "@angular/material/tooltip";

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
        MatTooltipModule
    ],
    providers: [TitleCasePipe]
})

export class PaymentReceiptModule {

}