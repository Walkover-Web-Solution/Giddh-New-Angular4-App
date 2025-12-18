import { CommonModule } from "@angular/common";
import { Injector, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ClickOutsideModule } from "ng-click-outside";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommandKModule } from "../../theme/command-k/command.k.module";
import { AuthServiceConfig, GoogleLoginProvider } from "../../theme/ng-social-login-module";
import { SocialLoginModule } from "../../theme/ng-social-login-module/auth.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { GenericAsideMenuAccountModule } from "../generic-aside-menu-account/generic.aside.menu.account.module";
import { CompanyBranchComponent } from "./company-branch/company-branch.component";
import { PrimarySidebarComponent } from "./primary-sidebar.component";
import { IServiceConfigArgs, ServiceConfig } from "../../services/service.config";
import { MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import {CdkTreeModule} from '@angular/cdk/tree';
import { MatInputModule } from "@angular/material/input";
import { CheckPermissionModule } from "../../permissions/check-permission.module";
import { get } from '../../lodash-optimized';


@NgModule({
    declarations: [
        PrimarySidebarComponent,
        CompanyBranchComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        ClickOutsideModule,
        MatTooltipModule,
        RouterModule,
        // CheckPermissionModule, // Commented out due to NG6002 errors
        CommandKModule,
        SocialLoginModule,
        // GenericAsideMenuAccountModule, // Commented out due to NG6002 errors
        MatDialogModule,
        MatTabsModule,
        MatMenuModule,
        MatButtonModule,
        CdkTreeModule,
        MatInputModule
    ],
    exports: [
        PrimarySidebarComponent
    ],
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: (injector: Injector) => {
                const serviceConfig = injector.get(ServiceConfig) as IServiceConfigArgs;
                return new AuthServiceConfig(
                    [
                        {
                            id: GoogleLoginProvider.PROVIDER_ID,
                            provider: new GoogleLoginProvider(serviceConfig?.GOOGLE_CLIENT_ID || '')
                        }
                    ],
                    false
                );
            },
            deps: [Injector]
        }
    ]
})

export class PrimarySidebarModule {

}
