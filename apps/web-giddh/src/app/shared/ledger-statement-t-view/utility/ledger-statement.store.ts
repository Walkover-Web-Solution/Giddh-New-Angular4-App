
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { ToasterService } from "../../../services/toaster.service";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "../../../store";

export interface LedgerStatementState {
}

export const DEFAULT_LEDGER_STATEMENT_STATE: LedgerStatementState = {
};

@Injectable()
export class LedgerStatementComponentStore extends ComponentStore<LedgerStatementState> implements OnDestroy {

    constructor(
        private store: Store<AppState>
    ) {
        super(DEFAULT_LEDGER_STATEMENT_STATE);
    }
    
    public currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), (response) => response);
    public isBranchConsolidated$ = this.store.pipe(select(select => select.branchConsolidated), (response) => response);
    public activeCompany$ = this.store.pipe(select(appState => appState.session.activeCompany), (response) => response);
    public ledgerTransactionsBalance$ = this.store.pipe(select(p => p.ledger.ledgerTransactionsBalance));
    public transactionData$ = this.store.pipe(select(p => p.ledger.transactionsResponse));
    public activeAccount$ = this.store.pipe(select(p => p.ledger.account));
    public companyProfile$ = this.store.pipe(select(p => p.settings.profile));
    public isTransactionRequestInProcess$ = this.store.pipe(select(p => p.ledger.transactionInprogress));
    

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof LedgerStatementComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
