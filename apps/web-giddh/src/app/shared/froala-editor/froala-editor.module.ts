import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FroalaEditorComponent } from './froala-editor.component';
import { FroalaViewModule, FroalaEditorModule } from 'angular-froala-wysiwyg';

@NgModule({
  imports: [
        CommonModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot()
    ],
    exports: [
        CommonModule,
        FroalaEditorModule,
        FroalaViewModule,
        FroalaEditorComponent
    ],
    declarations: [FroalaEditorComponent]
})
export class FroalaTemplateEditorModule { }
