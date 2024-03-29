import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ClickOutsideModule } from "ng-click-outside";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CheckPermissionModule } from "../../permissions/check-permission.module";
import { CommandKModule } from "../../theme/command-k/command.k.module";
import { AuthServiceConfig, GoogleLoginProvider } from "../../theme/ng-social-login-module";
import { SocialLoginModule } from "../../theme/ng-social-login-module/auth.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { GenericAsideMenuAccountModule } from "../generic-aside-menu-account/generic.aside.menu.account.module";
import { CompanyBranchComponent } from "./company-branch/company-branch.component";
import { PrimarySidebarComponent } from "./primary-sidebar.component";

const SOCIAL_CONFIG = isElectron ? null : new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID)
    }
], false);

export function provideConfig() {
    return SOCIAL_CONFIG || { id: null, providers: [] };
}

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
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        RouterModule,
        CheckPermissionModule,
        CommandKModule,
        TabsModule.forRoot(),
        SocialLoginModule,
        GenericAsideMenuAccountModule,
        MatDialogModule
    ],
    exports: [
        PrimarySidebarComponent
    ],
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        }
    ]
})

export class PrimarySidebarModule {
    
}