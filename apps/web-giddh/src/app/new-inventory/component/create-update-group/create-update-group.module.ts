import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
// import { GiddhPageLoaderModule } from "../../../shared/giddh-page-loader/giddh-page-loader.module";
import { HamburgerMenuModule } from "../../../shared/header/components/hamburger-menu/hamburger-menu.module";
// import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
// Temporarily disabled;
import { TranslateDirectiveModule } from "../../../theme/translate/translate.directive.module";
import { InventorySidebarModule } from "../inventory-sidebar/inventory-sidebar.module";
import { CreateUpdateGroupComponent } from "./create-update-group.component";
import { GroupCreateEditRoutingModule } from "./create-update-group.routing.module";
import { MainGroupComponent } from "./main-group.component";
import { WatchVideoModule } from "../../../theme/watch-video/watch-video.module";
import { PageLeaveConfirmationGuard } from "../../../decorators/page-leave-confirmation-guard";
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        MainGroupComponent,
        CreateUpdateGroupComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        FormsModule,
        GroupCreateEditRoutingModule,
        InventorySidebarModule,
        TranslateDirectiveModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        HamburgerMenuModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        WatchVideoModule
    
    ],
    exports: [
        CreateUpdateGroupComponent
    ],
    providers: [
        PageLeaveConfirmationGuard
    
    ]
})
export class GroupCreateEditModule {

}