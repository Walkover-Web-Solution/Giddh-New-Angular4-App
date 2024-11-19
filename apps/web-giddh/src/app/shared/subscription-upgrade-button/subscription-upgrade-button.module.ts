import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SubscriptionUpgradeButtonComponent } from "./subscription-upgrade-button.component";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    declarations: [
        SubscriptionUpgradeButtonComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule
    ],
    exports: [
        SubscriptionUpgradeButtonComponent
    ]
})

export class SubscriptionUpgradeButtonModule {
}
