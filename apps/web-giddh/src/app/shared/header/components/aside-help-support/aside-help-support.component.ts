import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { AccountsAction } from '../../actions/accounts.actions';
import { CompanyActions } from "../../actions/company.actions";
import { takeUntil, take } from 'rxjs/operators';
import { Observable, of as observableOf, ReplaySubject } from "rxjs";
import { VerifyEmailResponseModel, VerifyMobileModel } from "../../models/api-models/loginModels";
import { AccountResponseV2 } from "../../models/api-models/Account";
import { CompanyService } from "../../services/companyService.service";
import { BankTransferRequest } from "../../models/api-models/Company";
import { IRegistration } from "../../models/interfaces/registration.interface";
import { ToasterService } from "../../services/toaster.service";

@Component({
    selector: 'aside-help-support',
    templateUrl: './aside-help-support.component.html',
    styleUrls: [`./aside-help-support.component.scss`],
})

export class AsideHelpSupportComponent implements OnInit {

    //Event emitter to close the Aside panel
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    public closeAsidePane(event?) {
        this.closeAsideEvent.emit(event);
    }
    
    public ngOnInit() {

    }

}