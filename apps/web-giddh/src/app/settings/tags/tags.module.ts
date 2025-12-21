import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { SettingsTagsComponent } from './tags.component';
import { SharedModule } from '../../shared/shared.module';
import { NoDataModule } from '../../shared/no-data/no-data.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        SettingsTagsComponent
    ],
    imports: [
        CommonModule,
        // SharedModule, // COMMENTED OUT - CAUSING CIRCULAR DEPENDENCY NG6002 ERRORS
        FormsModule,
        ReactiveFormsModule,
        NoDataModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatChipsModule,
    ],
    exports: [
        SettingsTagsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})

export class TagsModule { }
