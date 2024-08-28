import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupNameComponent } from './group-name.component';
import { GroupNameRoutingModule } from './group-name.routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from "@angular/forms";
import { SelectTableColumnModule } from '../shared/select-table-column/select-table-column.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    GroupNameRoutingModule,
    MatTableModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    TranslateDirectiveModule,
    HamburgerMenuModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    SelectTableColumnModule,
    MatPaginatorModule
  ],
  declarations: [GroupNameComponent]
})
export class GroupNameModule { }
