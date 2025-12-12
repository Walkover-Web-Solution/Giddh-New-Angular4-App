import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface VoucherState {
  isLoading: boolean;
  vouchers: any[];
  selectedVoucher: any;
  error: string | null;
}

const initialState: VoucherState = {
  isLoading: false,
  vouchers: [],
  selectedVoucher: null,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class VoucherComponentStore extends ComponentStore<VoucherState> {
  constructor() {
    super(initialState);
  }

  // Add selectors and updaters here when needed
  readonly isLoading$ = this.select(state => state.isLoading);
  readonly vouchers$ = this.select(state => state.vouchers);
  readonly selectedVoucher$ = this.select(state => state.selectedVoucher);
  readonly branchList$ = this.select(state => state.vouchers); // Placeholder for branch list
}
