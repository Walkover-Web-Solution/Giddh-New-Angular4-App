import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IFlattenAccountsResultItem } from 'app/models/interfaces/flattenAccountsResultItem.interface';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { AppState } from './../store/roots';
import { SessionState } from './../store/authentication/authentication.reducer';
import { Injectable, HostListener } from '@angular/core';
import { createSelector } from 'reselect';

export interface IPageInfo {
  page: string;
  uniqueName: string;
  gridType: string;
}

@Injectable()
export class TallyModuleService {

  public selectedPageInfo: BehaviorSubject<IPageInfo> = new BehaviorSubject(null);

  public flattenAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
  public cashAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
  public purchaseAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
  public bankAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
  public taxAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
  public expenseAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
  public salesAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);

  public filteredAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);

  public requestData: BehaviorSubject<any> = new BehaviorSubject(null);

  public transactionObj: object = {};

  public setVoucher(info: IPageInfo) {
    this.selectedPageInfo.next(info);
    this.getAccounts();
  }

  public setFlattenAccounts(accounts: IFlattenAccountsResultItem[]) {
    let cashAccounts = [];
    let purchaseAccounts = [];
    let bankAccounts = [];
    let taxAccounts = [];
    let expenseAccounts = [];
    let salesAccounts = [];
    accounts.forEach((acc) => {
      let cashAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'cash');
      if (cashAccount) {
        cashAccounts.push(acc);
      }
      let purchaseAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'purchases');
      if (purchaseAccount) {
        purchaseAccounts.push(acc);
      }
      let bankAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'bankaccounts');
      if (bankAccount) {
        bankAccounts.push(acc);
      }
      let taxAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'currentliabilities');
      if (taxAccount) {
        taxAccounts.push(acc);
      }
      let expenseAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'indirectexpenses' || pg.uniqueName === 'operatingcost');
      if (expenseAccount) {
        expenseAccounts.push(acc);
      }
      let salesAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'revenuefromoperations');
      if (salesAccount) {
        salesAccounts.push(acc);
      }
    });
    this.cashAccounts.next(cashAccounts);
    this.purchaseAccounts.next(purchaseAccounts);
    this.bankAccounts.next(bankAccounts);
    this.taxAccounts.next(taxAccounts);
    this.expenseAccounts.next(expenseAccounts);
    this.salesAccounts.next(salesAccounts);
    this.flattenAccounts.next(accounts);
  }

  public getAccounts() {
    let accounts = [];
    if (this.selectedPageInfo.value) {
      console.log('this.selectedPageInfo.value inside service is :', this.selectedPageInfo.value);
      switch (this.selectedPageInfo.value.page) {
        case 'Journal':
          accounts = this.flattenAccounts.value;
          break;
        case 'Purchase':
          accounts = this.bankAccounts.value.concat(this.cashAccounts.value).concat(this.expenseAccounts.value).concat(this.purchaseAccounts.value);
          break;
        case 'Sales':
          accounts = this.bankAccounts.value.concat(this.cashAccounts.value).concat(this.expenseAccounts.value).concat(this.salesAccounts.value);
          break;
        case 'creditnote':
          accounts = this.taxAccounts.value.concat(this.salesAccounts.value);
          break;
        case 'Debit note':
          accounts = this.purchaseAccounts.value.concat(this.taxAccounts.value);
          break;
        case 'payments':
          accounts = this.cashAccounts.value.concat(this.bankAccounts.value);
          break;
        case 'receipt':
          accounts = this.cashAccounts.value.concat(this.bankAccounts.value);
        break;
        default:
          accounts = this.flattenAccounts.value;
      }
      if (accounts && accounts.length) {
        // console.log('accounts are :', accounts);
        this.filteredAccounts.next(accounts);
      }
    }
  }
}
