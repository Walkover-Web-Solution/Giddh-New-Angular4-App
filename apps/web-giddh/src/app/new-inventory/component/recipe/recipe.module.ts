import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { ListRecipeComponent } from './list-recipe/list-recipe.component';
import { InventorySidebarModule } from '../inventory-sidebar/inventory-sidebar.module';
import { HamburgerMenuModule } from '../../../shared/header/components/hamburger-menu/hamburger-menu.module';
// import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatButtonModule } from '@angular/material/button';
import { RecipeRoutingModule } from './recipe.routing.module';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateDirectiveModule } from '../../../theme/translate/translate.directive.module';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    imports: [
        CommonModule,
        InventorySidebarModule,
        HamburgerMenuModule,
        MatChipsModule,
        RecipeRoutingModule,
        TranslateDirectiveModule,
        FormsModule,
        MatTooltipModule,
        MatExpansionModule,
        MatSlideToggleModule
    
    ],
    exports: [
        CreateRecipeComponent,
        ListRecipeComponent
    
    ],
    declarations: [
        MainComponent,
        CreateRecipeComponent,
        ListRecipeComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ]
})
export class RecipeModule { }
