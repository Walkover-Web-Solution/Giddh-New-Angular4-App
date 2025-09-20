import { BankIntegrationComponent } from "./bank-integration.component";
import { InstitutionsListComponent } from "./institutions-list/institutions-list.component";
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatGridListModule } from "@angular/material/grid-list";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatRadioModule } from "@angular/material/radio";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { WatchVideoModule } from "../../theme/watch-video/watch-video.module";
import { NgModule } from "@angular/core";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { SettingIntegrationPaymentModule } from "../../settings/integration/payment/setting.integration.payment.module";
import { AccountNumberMaskModule } from "../helpers/pipes/accountNumberMaskPipe/accountNumberMask.module";
import { GiddhPageLoaderModule } from "../giddh-page-loader/giddh-page-loader.module";
import { BankLinkComponent } from "./bank-link/bank-link.component";
import { BankIntegrationDialogComponent } from "./bank-integration-popup/bank-integration-popup.component";

@NgModule({
    declarations: [BankIntegrationComponent, InstitutionsListComponent, BankLinkComponent, BankIntegrationDialogComponent ],
    imports: [
        CommonModule,
        MatListModule,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatTableModule,
        MatSelectModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatGridListModule,
        FormFieldsModule,
        MatInputModule,
        MatCheckboxModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatTooltipModule,
        MatMenuModule,
        MatDatepickerModule,
        WatchVideoModule,
        TranslateDirectiveModule,
        SettingIntegrationPaymentModule,
        AccountNumberMaskModule,
        GiddhPageLoaderModule

    ],
    exports: [BankIntegrationComponent, InstitutionsListComponent, BankLinkComponent, BankIntegrationDialogComponent]
})
export class BankIntegrationModule {}
