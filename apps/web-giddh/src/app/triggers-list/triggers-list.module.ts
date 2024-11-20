
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TriggersListComponent } from './triggers-list.component';
import { TriggersListRoutingModule } from './tiggers-list.routing.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { MatTableModule } from '@angular/material/table';
import { GiddhDateRangepickerModule } from '../theme/giddh-daterangepicker/giddh-daterangepicker.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
        CommonModule,
        MatInputModule,
        MatChipsModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatDialogModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        MatSelectModule,
        MatCheckboxModule,
        TriggersListRoutingModule,
        TranslateDirectiveModule,
        MatTableModule,
        GiddhDateRangepickerModule,
        GiddhPageLoaderModule,
        HamburgerMenuModule,
        MatPaginatorModule
    ],
    exports: [
        TriggersListComponent
    ],
    declarations: [TriggersListComponent]
})
export class TriggersListModule { }
