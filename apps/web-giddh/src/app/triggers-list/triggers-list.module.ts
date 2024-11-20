
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
        TriggersListRoutingModule
    ],
    exports: [
        TriggersListComponent
    ],
    declarations: [TriggersListComponent]
})
export class TriggersListModule { }
