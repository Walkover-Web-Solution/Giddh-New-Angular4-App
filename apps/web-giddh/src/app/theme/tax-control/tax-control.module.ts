import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxMaskModule } from '../../shared/helpers/directives/ngx-mask';
import { TaxControlComponent } from './tax-control.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormFieldsModule } from '../form-fields/form-fields.module';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        NgxMaskModule.forRoot(),
        MatMenuModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,
        FormFieldsModule
    ],
    declarations: [TaxControlComponent],
    exports: [TaxControlComponent]
})

/**
 * TaxControlModule module
 * Implements TaxControlModule functionality
 */
export class TaxControlModule { }
