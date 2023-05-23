import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeComponent } from './recipe.component';
import { MainComponent } from './main.component';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { ListRecipeComponent } from './list-recipe/list-recipe.component';
import { InventorySidebarModule } from '../inventory-sidebar/inventory-sidebar.module';
import { HamburgerMenuModule } from '../../../shared/header/components/hamburger-menu/hamburger-menu.module';

@NgModule({
    imports: [
        CommonModule,
        InventorySidebarModule,
        HamburgerMenuModule
    ],
    exports: [
        RecipeComponent,
        CreateRecipeComponent,
        ListRecipeComponent
    ],
    declarations: [RecipeComponent, MainComponent, CreateRecipeComponent, ListRecipeComponent]
})
export class RecipeModule { }
