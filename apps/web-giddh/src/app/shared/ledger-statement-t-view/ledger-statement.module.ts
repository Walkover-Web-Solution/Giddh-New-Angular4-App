import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
import { GiddhPageLoaderModule } from "../giddh-page-loader/giddh-page-loader.module";
import { LedgerStatementComponent } from "./ledger-statement.component";
import { ValidateSectionPermissionDirectiveModule } from '../validate-section-permission/validate-section-permission.module';
import { ParticularPipeModule } from '../../ledger/pipes/particular/particular.module';
import { AmountFieldComponentModule } from '../amount-field/amount-field.module';
import { LedgerModule } from '../../ledger/ledger.module';
import { GiddhLedgerPaginatorModule } from '../giddh-ledger-paginator/giddh-ledger-paginator.module';

@NgModule({
    declarations: [LedgerStatementComponent],
    imports: [
        CommonModule,
        MatListModule,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
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
        MatRadioModule,
        MatTooltipModule,
        MatDatepickerModule,
        WatchVideoModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        ValidateSectionPermissionDirectiveModule,
        ParticularPipeModule,
        AmountFieldComponentModule,
        LedgerModule,
        GiddhLedgerPaginatorModule
    ],
    exports: [LedgerStatementComponent]
})
export class LedgerStatementModule {}
