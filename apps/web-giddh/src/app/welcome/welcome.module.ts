import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Route, RouterModule } from "@angular/router";
import { LoaderModule } from "../loader/loader.module";
import { LayoutModule } from "../shared/layout/layout.module";
import { ShSelectModule } from "../theme/ng-virtual-select/sh-select.module";
import { WelcomeComponent } from "./welcome.component";

const routes: Array<Route> = [{
    path: '', pathMatch: 'full', component: WelcomeComponent
}]
@NgModule({
    declarations: [WelcomeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        LayoutModule,
        LoaderModule,
        FormsModule,
        ShSelectModule
    ],
    exports: [
        WelcomeComponent,
        RouterModule
    ]
})
export class WelcomeModule {}