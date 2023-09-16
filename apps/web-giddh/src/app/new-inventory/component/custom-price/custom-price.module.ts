import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { InventorySidebarModule } from '../inventory-sidebar/inventory-sidebar.module';
import { HamburgerMenuModule } from '../../../shared/header/components/hamburger-menu/hamburger-menu.module';
import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateDirectiveModule } from '../../../theme/translate/translate.directive.module';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerWiseComponent } from './customer-wise/customer-wise.component';
import { CustomPriceRoutingModule } from './custom-price.routing.module';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatDialogModule } from '@angular/material/dialog';
import { CommandKModule } from '../../../theme/command-k/command.k.module';

@NgModule({
    imports: [
        CommonModule,
        InventorySidebarModule,
        HamburgerMenuModule,
        FormFieldsModule,
        MatButtonModule,
        MatChipsModule,
        TranslateDirectiveModule,
        FormsModule,
        MatTooltipModule,
        CustomPriceRoutingModule,
        MatListModule,
        MatTableModule,
        MatSlideToggleModule,
        PaginationModule,
        MatDialogModule,
        CommandKModule
    ],
    exports: [
        CustomerWiseComponent
    ],
    declarations: [MainComponent, CustomerWiseComponent]
})
export class CustomPriceModule { }
