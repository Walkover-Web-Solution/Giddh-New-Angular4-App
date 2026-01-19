import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SubscriptionUpgradeButtonComponent } from "./subscription-upgrade-button.component";
import { MatButtonModule } from "@angular/material/button";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        SubscriptionUpgradeButtonComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        TranslateDirectiveModule
    ],
    exports: [
        SubscriptionUpgradeButtonComponent
    ]
})

/**
 * SubscriptionUpgradeButtonModule module
 * Implements SubscriptionUpgradeButtonModule functionality
 */
export class SubscriptionUpgradeButtonModule {
}
