import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FroalaViewModule, FroalaEditorModule } from 'angular-froala-wysiwyg';
import { TemplateFroalaComponent } from './template-froala.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClickOutsideModule } from 'ng-click-outside';
import { A11yModule } from '@angular/cdk/a11y';
import { ReplaceAllPipeModule } from '../helpers/pipes/replaceAll/replaceAll.module';

@NgModule({
  imports: [
        CommonModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        TranslateDirectiveModule,
        MatInputModule,
        FormFieldsModule,
        MatChipsModule,
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
    declarations: [TemplateFroalaComponent],
    providers: [TitleCasePipe]
})
export class FroalaTemplateEditorModule { }
