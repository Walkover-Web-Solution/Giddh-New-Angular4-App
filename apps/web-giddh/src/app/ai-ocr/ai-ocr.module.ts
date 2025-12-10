import { NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
// import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { NoDataModule } from "../shared/no-data/no-data.module";
import { HamburgerMenuModule } from "../shared/header/components/hamburger-menu/hamburger-menu.module";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";
// import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
// Temporarily disabled;
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ClickOutsideModule } from "ng-click-outside";
// import { SharedModule } from "../shared/shared.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { VouchersModule } from "../vouchers/vouchers.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GiddhProgressSpinnerComponent } from "../shared/giddh-progress-spinner/giddh-progress-spinner.component";
import { AiOcrComponent } from "./ai-ocr.component";
import { AiOcrCreateComponent } from "./ai-ocr-create/ai-ocr-create.component";
import { AiOcrListComponent } from "./ai-ocr-list/ai-ocr-list.component";
import { AiOcrRoutingModule } from "./ai-ocr.routing.module";
import { MatBadgeModule } from "@angular/material/badge";
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    imports: [
        ScrollingModule,
        CommonModule,
        RouterModule,
        TranslateDirectiveModule,
        AiOcrRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatPaginatorModule,
        MatDialogModule,
        MatTableModule,
        MatTooltipModule,
        NoDataModule,
        HamburgerMenuModule,
        MatMenuModule,
        MatSortModule,
        FormsModule,
        MatCardModule,
        MatRadioModule,
        MatButtonToggleModule,
        ClickOutsideModule,
        VouchersModule,
        MatProgressSpinnerModule,
        GiddhProgressSpinnerComponent,
        MatBadgeModule
    
    ],
    exports: [],
    declarations: [
        AiOcrComponent,
        AiOcrCreateComponent,
        AiOcrListComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ],
    providers: [],
})
export class AiOcrModule {}
