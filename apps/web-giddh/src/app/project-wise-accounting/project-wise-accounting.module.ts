import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { GiddhDateRangepickerModule } from '../theme/giddh-daterangepicker/giddh-daterangepicker.module';
import { MatIconModule } from '@angular/material/icon';
import { ProjectWiseAccountingRoutingModule } from './project-wise-accounting.routing.module';
import { ProjectWiseAccountingListComponent } from './list/project-wise-accounting.component';
import { RevenueExpenseListComponent } from './revenue-expense-list/revenue-expense-list.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { MainComponent } from './main.component';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { DiscountDropdownModule } from '../theme/discount-dropdown/discount-dropdown.module';
import { ProjectAccountingService } from './project-wise-accounting.service';

@NgModule({
    declarations: [
        MainComponent,
        ProjectWiseAccountingListComponent,
        RevenueExpenseListComponent,
        CreateProjectComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FormFieldsModule,
        ProjectWiseAccountingRoutingModule,
        MatButtonModule,
        MatTableModule,
        GiddhDateRangepickerModule,
        MatIconModule,
        TranslateDirectiveModule,
        MatPaginatorModule,
        MatTabsModule,
        MatDialogModule,
        DiscountDropdownModule,
        ReactiveFormsModule
    ],
    exports: [CreateProjectComponent],
    providers: [ProjectAccountingService]
})
export class ProjectWiseAccountingModule { }
