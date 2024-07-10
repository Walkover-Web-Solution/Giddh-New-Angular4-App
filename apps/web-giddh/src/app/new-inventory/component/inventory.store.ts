import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { AppState } from "../../store";
import { InventoryService } from "../../services/inventory.service";
import { Observable, switchMap } from "rxjs";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { ToasterService } from "../../services/toaster.service";
import { Router } from "@angular/router";

@Injectable()
export class InventoryComponentStore extends ComponentStore<any> {
    actions$: any;
    constructor(
        private store: Store<AppState>,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        public router: Router
    ) {
        super({});
    }

    readonly exportStock = this.effect((data$: Observable<{ stockReportRequest: any, queryParams: any }>) => {
        return data$.pipe(
            switchMap((req) => {
                return this.inventoryService.getItemWiseReportExport(req.queryParams, req.stockReportRequest).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                if (typeof res?.body === "string") {
                                    this.toaster.showSnackBar("success", res?.body);
                                    this.router.navigate(["/pages/downloads"]);
                                }
                            } else {
                                this.toaster.showSnackBar("error", res?.message);
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                        }
                    ),
                )
            }
            )
        );
    });
}