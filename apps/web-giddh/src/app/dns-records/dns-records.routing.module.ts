import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DnsRecordsComponent } from "./dns-records.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: DnsRecordsComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class DnsRecordsRoutingModule {
}
