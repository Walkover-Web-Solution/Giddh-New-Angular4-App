import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ClickOutsideModule } from "ng-click-outside";
import { AsideSettingComponent } from "./aside-setting.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        RouterModule
    ],
    declarations: [
        AsideSettingComponent
    ],
    exports: [
        AsideSettingComponent,
        RouterModule
    ]
})
export class AsideSettingModule {}