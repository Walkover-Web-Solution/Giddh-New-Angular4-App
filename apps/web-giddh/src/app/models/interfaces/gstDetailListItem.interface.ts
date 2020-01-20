import { IAddressListItem } from './addressDetailItem.interface';

export interface IGstDetailListItem {
    gstNumber: string;
    addressList: IAddressListItem[];
}
