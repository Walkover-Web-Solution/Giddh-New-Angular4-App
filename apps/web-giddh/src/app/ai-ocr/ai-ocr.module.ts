import { NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { NoDataModule } from "../shared/no-data/no-data.module";
import { HamburgerMenuModule } from "../shared/header/components/hamburger-menu/hamburger-menu.module";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ClickOutsideModule } from "ng-click-outside";
import { SharedModule } from "../shared/shared.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { VouchersModule } from "../vouchers/vouchers.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GiddhProgressSpinnerComponent } from "../shared/giddh-progress-spinner/giddh-progress-spinner.component";
import { AiOcrComponent } from "./ai-ocr.component";
import { AiOcrCreateComponent } from "./ai-ocr-create/ai-ocr-create.component";
import { AiOcrListComponent } from "./ai-ocr-list/ai-ocr-list.component";
import { AiOcrRoutingModule } from "./ai-ocr.routing.module";
import { MatBadgeModule } from "@angular/material/badge";

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
        GiddhPageLoaderModule,
        HamburgerMenuModule,
        MatMenuModule,
        MatSortModule,
        FormFieldsModule,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatRadioModule,
        MatButtonToggleModule,
        ClickOutsideModule,
        SharedModule,
        VouchersModule,
        MatProgressSpinnerModule,
        GiddhProgressSpinnerComponent,
        MatBadgeModule
    ],
    exports: [],
    declarations: [AiOcrComponent, AiOcrCreateComponent, AiOcrListComponent],
    providers: [],
})
export class AiOcrModule {}
