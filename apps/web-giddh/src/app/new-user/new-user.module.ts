import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { HeaderModule } from "../shared/header/header.module";
import { LayoutModule } from "../shared/layout/layout.module";
import { NewUserComponent } from "./new-user.component";

const routes: Array<Route> = [{
    path: '', pathMatch: 'full', component: NewUserComponent
}]
@NgModule({
    declarations: [NewUserComponent],
    exports: [NewUserComponent, RouterModule],
    imports: [
        HeaderModule,
        LayoutModule,
        RouterModule.forChild(routes)
    ]
})
export class NewUserModule {

}