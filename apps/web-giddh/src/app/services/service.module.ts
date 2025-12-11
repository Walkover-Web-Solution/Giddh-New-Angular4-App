import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpWrapperService } from "./http-wrapper.service";
import { GeneralService } from './general.service';
import { LoaderService } from '../loader/loader.service';
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { DashboardService } from './dashboard.service';
import { GroupService } from './group.service';
import { GstReconcileService } from './gst-reconcile.service';
import { DbService } from './db.service';
import { AuthenticationService } from './authentication.service';
import { ToasterService } from './toaster.service';
import { CompanyService } from './company.service';

// Essential placeholder services for compilation
class PermissionDataService {
    // Placeholder implementation
}

class VouchersUtilityService {
    createQueryString(baseUrl: string, params: any): string {
        const queryParams = new URLSearchParams(params).toString();
        return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    }
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule
    ]
})
export class ServiceModule {
    public static forRoot(): ModuleWithProviders<ServiceModule> {
        return {
            ngModule: ServiceModule,
            providers: [
                GeneralService,
                LoaderService,
                GiddhErrorHandler,
                HttpWrapperService,
                PermissionDataService,
                VouchersUtilityService,
                DashboardService,
                GroupService,
                GstReconcileService,
                DbService,
                AuthenticationService,
                ToasterService,
                CompanyService
            ]
        };
    }
}
