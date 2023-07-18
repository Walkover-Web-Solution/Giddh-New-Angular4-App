import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { SelectTableColumnComponent } from './select-table-column.component';

@NgModule({
    declarations: [SelectTableColumnComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatTooltipModule,
        MatCheckboxModule,
        FormsModule
    ],
    exports: [SelectTableColumnComponent]
})
export class SelectTableColumnModule { }
