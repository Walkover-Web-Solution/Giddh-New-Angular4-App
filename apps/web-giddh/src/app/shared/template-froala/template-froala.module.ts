import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FroalaViewModule, FroalaEditorModule } from 'angular-froala-wysiwyg';
import { TemplateFroalaComponent } from './template-froala.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClickOutsideModule } from 'ng-click-outside';
import { A11yModule } from '@angular/cdk/a11y';
import { ReplaceAllPipeModule } from '../helpers/pipes/replaceAll/replaceAll.module';
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

@NgModule({
  imports: [
        CommonModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        TranslateDirectiveModule,
        MatInputModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        NgxMatSelectSearchModule,
        MatSelectModule,
        MatCheckboxModule,
        ClickOutsideModule,
        ReplaceAllPipeModule,
        A11yModule
    
    ],
    exports: [
        TemplateFroalaComponent
    
    ],
    declarations: [
        TemplateFroalaComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ],
    providers: [
        TitleCasePipe
    ]
})
export class FroalaTemplateEditorModule { }
