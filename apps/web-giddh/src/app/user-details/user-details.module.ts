import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { UserDetailsRoutingModule } from './user-details.routing.module';
import { UserDetailsComponent } from './user-details.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
import { LaddaModule } from 'angular2-ladda';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/lib/perfect-scrollbar.interfaces';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { SharedModule } from "../shared/shared.module";
import { ElementViewChildModule } from "../shared/helpers/directives/elementViewChild/elementViewChild.module";
import { UserDetailsPipe } from './user-details.pipe';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SubscriptionsPlansComponent } from './components/subscriptions-plans/subscriptions-plans.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CompanyDetailsSidebarComponent } from './components/company-details-sidebar/company-details-sidebar.component';
import { MoveCompanyComponent } from './components/move-company/move-company.component';
import { AllFeaturesComponent } from './components/all-features/all-features.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { AddOnsComponent } from './components/add-ons/add-ons.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { SafePipeModule } from '../shared/helpers/pipes/safePipe/safePipe.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({

    declarations: [
        // Components / Directives/ Pipes
        UserDetailsComponent,
        UserDetailsPipe,
        SubscriptionsPlansComponent,
        CompanyDetailsSidebarComponent,
        MoveCompanyComponent,
        AllFeaturesComponent,
        SubscriptionComponent,
        AddOnsComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UserDetailsRoutingModule,
        TabsModule.forRoot(),
        AlertModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        PerfectScrollbarModule,
        DecimalDigitsModule,
        SharedModule,
        ElementViewChildModule,
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        ScrollingModule,
        NoDataModule,
        MatToolbarModule,
        MatSelectModule,
        MatButtonModule,
        MatGridListModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatExpansionModule,
        MatDividerModule,
        MatTableModule,
        MatDialogModule,
        ShSelectModule,
        MatSliderModule,
        MatCardModule,
        SafePipeModule,
        GiddhPageLoaderModule,
        NoDataModule,
        NgxBootstrapSwitchModule.forRoot()
    ],
    providers: [

        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        DecimalPipe
    ]

})
export class UserDetailsModule {

}
