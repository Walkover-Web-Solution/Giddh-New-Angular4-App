import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { HamburgerMenuModule } from "../shared/header/components/hamburger-menu/hamburger-menu.module";
import { CustomFieldsCreateEditComponent } from "./create-edit/create-edit.component";
import { CustomFieldsRoutingModule } from "./custom-fields.routing.module";
import { CustomFieldsListComponent } from "./list/list.component";
import { MainComponent } from "./main.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
// import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
// Temporarily disabled;
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { NoDataModule } from "../shared/no-data/no-data.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { WatchVideoModule } from "../theme/watch-video/watch-video.module";
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        MainComponent,
        CustomFieldsListComponent,
        CustomFieldsCreateEditComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        RouterModule,
        CustomFieldsRoutingModule,
        HamburgerMenuModule,
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        TranslateDirectiveModule,
        MatPaginatorModule,
        FormsModule,
        NoDataModule,
        MatSlideToggleModule,
        WatchVideoModule,
        ReactiveFormsModule
    
    ]
})
export class CustomFieldsModule {

}
