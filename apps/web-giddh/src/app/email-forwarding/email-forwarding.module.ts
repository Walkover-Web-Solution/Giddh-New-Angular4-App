import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
// import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
// Temporarily disabled;
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { BankStatementRoutingModule } from './email-forwarding.routing.module';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { ListComponent } from './components/list/list.component';
import { CreateComponent } from './components/create/create.component';
import { EmailForwardingService } from './services/email-forwarding.service';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { NewConfirmationModalModule } from '../theme/new-confirmation-modal/confirmation-modal.module';
import { MatDividerModule } from '@angular/material/divider';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { ClipboardModule } from 'ngx-clipboard';
import { MatDialogModule } from '@angular/material/dialog';
import { GenericAsideMenuAccountModule } from '../shared/generic-aside-menu-account/generic.aside.menu.account.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        OnboardingComponent,
        ListComponent,
        CreateComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatTableModule,
        MatTooltipModule,
        MatCardModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        NewConfirmationModalModule,
        TranslateDirectiveModule,
        MatDividerModule,
        HamburgerMenuModule,
        ClipboardModule,
        MatDialogModule
    
    ],
    providers: [
        EmailForwardingService
    
    ]
})
export class BankStatementModule {
}
