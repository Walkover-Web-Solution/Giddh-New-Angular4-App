import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NewUserAuthGuard } from "../decorators/newUserGuard";
import { NewUserComponent } from "./new-user.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: NewUserComponent, canActivate: [NewUserAuthGuard]
            }
        ])
    ],
    exports: [RouterModule]
})
export class NewUserRoutingModule {
}
