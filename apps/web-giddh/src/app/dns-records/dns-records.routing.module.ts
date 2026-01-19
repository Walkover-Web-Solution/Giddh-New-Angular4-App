import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DnsRecordsComponent } from "./dns-records.component";

/**
 * Handles NgModule functionality
 */
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
/**
 * DnsRecordsRoutingModule module
 * Implements DnsRecordsRoutingModule functionality
 */
export class DnsRecordsRoutingModule {
}
