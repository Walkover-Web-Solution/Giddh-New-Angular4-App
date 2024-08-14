import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
        FormFieldsModule
    ],
    exports: [
        TemplateFroalaComponent
    ],
    declarations: [TemplateFroalaComponent]
})
export class FroalaTemplateEditorModule { }
