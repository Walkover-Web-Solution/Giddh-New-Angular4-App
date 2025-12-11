import { Injectable } from '@angular/core';

export interface ITaxResponse {
    // Placeholder interface
    name?: string;
    rate?: number;
}

@Injectable({
    providedIn: 'root'
})
export class PurchaseInvoiceService {
    // Placeholder implementation
    constructor() {}
}