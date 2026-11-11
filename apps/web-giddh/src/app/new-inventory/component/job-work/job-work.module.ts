import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClickOutsideModule } from 'ng-click-outside';
import { BatchChipListComponent } from '../../../shared/batch-chip-list/batch-chip-list.component';
import { CommonTaxComponent } from '../../../shared/common-tax/common-tax.component';
import { MobileNumberInputComponent } from '../../../shared/mobile-number-input';
import { DatepickerWrapperModule } from '../../../shared/datepicker-wrapper/datepicker.wrapper.module';
import { GiddhPageLoaderModule } from '../../../shared/giddh-page-loader/giddh-page-loader.module';
import { GoToBranchComponent } from '../../../shared/go-to-branch/go-to-branch.component';
import { HamburgerMenuModule } from '../../../shared/header/components/hamburger-menu/hamburger-menu.module';
import { NoDataModule } from '../../../shared/no-data/no-data.module';
import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
import { GiddhDatepickerModule } from '../../../theme/giddh-datepicker/giddh-datepicker.module';
import { NewConfirmModalModule } from '../../../theme/new-confirm-modal';
import { TranslateDirectiveModule } from '../../../theme/translate/translate.directive.module';
import { BatchSelectDialogComponent } from '../../../vouchers/batch-select-dialog/batch-select-dialog.component';
import { InventorySidebarModule } from '../inventory-sidebar/inventory-sidebar.module';
import { CreateJobWorkComponent } from './create-job-work/create-job-work.component';
import { JobWorkListStateService } from './job-work-list-state.service';
import { JobWorkRoutingModule } from './job-work.routing.module';
import { ListJobWorkComponent } from './list-job-work/list-job-work.component';
import { JobWorkMainComponent } from './main.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClickOutsideModule,
        InventorySidebarModule,
        HamburgerMenuModule,
        FormFieldsModule,
        MatButtonModule,
        MatTableModule,
        MatDialogModule,
        MatTooltipModule,
        MatMenuModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatPaginatorModule,
        DatepickerWrapperModule,
        GiddhDatepickerModule,
        TranslateDirectiveModule,
        NoDataModule,
        GiddhPageLoaderModule,
        NewConfirmModalModule,
        BatchChipListComponent,
        BatchSelectDialogComponent,
        CommonTaxComponent,
        MobileNumberInputComponent,
        GoToBranchComponent,
        JobWorkRoutingModule
    ],
    declarations: [
        JobWorkMainComponent,
        CreateJobWorkComponent,
        ListJobWorkComponent
    ],
    providers: [
        JobWorkListStateService
    ]
})
export class JobWorkModule {
}
