import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewConfirmationModalModule } from '../theme/new-confirmation-modal/confirmation-modal.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { SharedModule } from '../shared/shared.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { SafePipeModule } from '../shared/helpers/pipes/safePipe/safePipe.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WatchVideoModule } from '../theme/watch-video/watch-video.module';
import { CallBackPageComponent } from '../shared/call-back-page/call-back-page.component';
import { OcrVoucherListComponent } from './ocr-voucher-list/ocr-voucher-list.component';
import { OcrVoucherRoutingModule } from './ocr-voucher.routing.module';
import { MatSelectModule } from '@angular/material/select';
import { OcrVoucherComponent } from './ocr-voucher.component';
import { OcrVoucherCreateComponent } from './ocr-voucher-create/ocr-voucher-create.component';
import { VouchersModule } from '../vouchers/vouchers.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GiddhProgressSpinnerComponent } from '../shared/giddh-progress-spinner/giddh-progress-spinner.component';

@NgModule({
    imports: [
        ScrollingModule,
        CommonModule,
        RouterModule,
        TranslateDirectiveModule,
        OcrVoucherRoutingModule,
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
        NewConfirmationModalModule,
        MatCardModule,
        MatStepperModule,
        MatRadioModule,
        MatButtonToggleModule,
        MatGridListModule,
        ClickOutsideModule,
        SharedModule,
        VouchersModule,
        MatProgressSpinnerModule,
        GiddhProgressSpinnerComponent
    ],
    exports: [
        OcrVoucherListComponent,
        OcrVoucherComponent,
        OcrVoucherCreateComponent
    ],
    declarations: [
        OcrVoucherListComponent,
        OcrVoucherComponent,
        OcrVoucherCreateComponent
    ],
    providers: [

    ]
})
export class OcrVoucherModule { }
