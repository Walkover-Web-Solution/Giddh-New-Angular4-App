
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { ToasterService } from "../../services/toaster.service";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { ContactService } from "../../services/contact.service";

export interface ContactState {
}

export const DEFAULT_CONTACT_STATE: ContactState = {
};

@Injectable()
export class ContactComponentStore extends ComponentStore<ContactState> implements OnDestroy {

    constructor(
        private toasterService: ToasterService,
        private contactService: ContactService
    ) {
        super(DEFAULT_CONTACT_STATE);
    }

    /**
     * Get Permissions Roles
     *
     * @memberof AddCompanyComponentStore
     */
    readonly sendCustomerInformation = this.effect((data: any) => {
        return data.pipe(
            switchMap((account: any) => {
                this.patchState({ sendCustomerInformationInProgress: true });
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
     * @memberof AddCompanyComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
