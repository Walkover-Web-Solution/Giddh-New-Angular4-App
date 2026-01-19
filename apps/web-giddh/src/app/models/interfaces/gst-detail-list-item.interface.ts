import { IAddressListItem } from './address-detail-item.interface';

/**
 * IGstDetailListItem interface definition
 * Defines the structure and contract for IGstDetailListItem objects
 */
export interface IGstDetailListItem {
    gstNumber: string;
    addressList: IAddressListItem[];
}
