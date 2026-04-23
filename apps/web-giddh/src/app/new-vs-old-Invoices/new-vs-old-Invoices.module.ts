import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { SharedModule } from '../shared/shared.module';
import { NewVsOldInvoicesComponent } from './new-vs-old-Invoices.component';
import { NewVsOldInvoicesRoutingModule } from './new-vs-old-Invoices.routing.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
import { SalesBifurcationDetailsComponent } from './sales-bifurcation-details/sales-bifurcation-details.component';
import { SalesByPersonComponent } from './sales-by-person/sales-by-person.component';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { AttachmentsModule } from '../theme/attachments/attachments.module';
import { ActionMenuComponent } from '../shared/action-menu/action-menu.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { GiddhDatePipe } from '../shared/pipes/giddh-date.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SalesPersonComponentStore } from '../shared/sales-person/utility/sales-person.store';
import { SalesPersonService } from '../shared/sales-person/utility/sales-person.service';
import { FroalaTemplateEditorModule } from '../shared/template-froala/template-froala.module';
import { NoDataModule } from '../shared/no-data/no-data.module';


@NgModule({
    declarations: [
        NewVsOldInvoicesComponent,
        SalesBifurcationDetailsComponent,
        SalesByPersonComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ElementViewChildModule,
        NewVsOldInvoicesRoutingModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        SharedModule,
        GiddhNumberFormatModule,
        FormFieldsModule,
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        KeyboardShortutModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        MatMenuModule,
        MatSortModule,
        AttachmentsModule,
        ActionMenuComponent,
        FroalaTemplateEditorModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        GiddhDatePipe,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatTooltipModule,
        MatCardModule,
        MatChipsModule,
        NoDataModule
    ],
    providers: []
})

export class NewVsOldInvoicesModule {

}
