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
import { TriggersRoutingModule } from './tiggers.routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BasicTriggerComponent } from './components/basic-trigger/basic-trigger.component';
import { AdvanceTriggerComponent } from './components/advance-trigger/advance-trigger.component';
import { TriggersComponent } from './triggers.component';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GiddhDateRangepickerModule } from '../../theme/giddh-daterangepicker/giddh-daterangepicker.module';
// import { GiddhPageLoaderModule } from '../giddh-page-loader/giddh-page-loader.module';
import { HamburgerMenuModule } from '../header/components/hamburger-menu/hamburger-menu.module';
import { MatMenuModule } from '@angular/material/menu';
// import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
// Temporarily disabled;
// import { SharedModule } from '../shared.module';
import { MatCardModule } from '@angular/material/card';
import { ReplaceAllPipeModule } from '../helpers/pipes/replaceAll/replaceAll.module';
import { FroalaTemplateEditorModule } from '../template-froala/template-froala.module';
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

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
        TriggersRoutingModule,
        TranslateDirectiveModule,
        MatTableModule,
        GiddhDateRangepickerModule,
        HamburgerMenuModule,
        MatPaginatorModule,
        MatMenuModule,
        ReplaceAllPipeModule,
        FroalaTemplateEditorModule
    
    ],
    exports: [
        TriggersComponent,
        BasicTriggerComponent,
        AdvanceTriggerComponent
    ],
    declarations: [
        TriggersComponent,
        BasicTriggerComponent,
        AdvanceTriggerComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ]
})
export class TriggersModule { }
