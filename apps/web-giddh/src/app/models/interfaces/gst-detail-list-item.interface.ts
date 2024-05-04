import { IAddressListItem } from './address-detail-item.interface';

export interface IGstDetailListItem {
    gstNumber: string;
    addressList: IAddressListItem[];
}
