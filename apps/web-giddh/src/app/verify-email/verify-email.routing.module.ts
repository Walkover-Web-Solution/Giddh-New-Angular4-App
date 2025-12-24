import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NeedsAuthentication } from "../decorators/needsAuthentication";
import { VerifyEmailComponent } from "./verify-email.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "", component: VerifyEmailComponent, children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: VerifyEmailComponent
                    }
                ],
                canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class VerifyEmailRoutingModule {
}
