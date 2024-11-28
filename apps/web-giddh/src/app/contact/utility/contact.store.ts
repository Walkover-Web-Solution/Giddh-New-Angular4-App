
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { switchMap, catchError, EMPTY, Observable } from "rxjs";
import { ToasterService } from "../../services/toaster.service";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { ContactService } from "../../services/contact.service";

@Injectable()
export class ContactComponentStore extends ComponentStore<any> implements OnDestroy {

    constructor(
        private toasterService: ToasterService,
        private contactService: ContactService
    ) {
        super();
    }

    /**
     * This will be use for send customer information
     *
     * @memberof ContactComponentStore
     */
    readonly sendCustomerInformation = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((account: string) => {
                return this.contactService.sendCustomerInformation(account).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar("success", res.body);
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });


    /**
     * Lifecycle hook for component destroy
     *
     * @memberof ContactComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
