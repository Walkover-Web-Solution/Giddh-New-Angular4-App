import { GeneralService } from '../../services/general.service';
import { IUlist } from '../../models/interfaces/ulist.interface';
import { NAVIGATION_ITEM_LIST } from '../../models/defaultMenus';

export class BaseMenuClass {
    constructor(public _generalService: GeneralService) {

    }

    public onItemSelected(uniqueName: string, additional: any) {
        uniqueName = `/pages/${uniqueName}`;
        let getItem = NAVIGATION_ITEM_LIST.find(ni => {
            if (additional) {
                if (ni.additional) {
                    return ni.uniqueName === uniqueName && additional.tabIndex === ni.additional.tabIndex;
                }
            } else {
                return ni.uniqueName === uniqueName;
            }
        });

        let newItem: IUlist = {
            name: getItem.name,
            uniqueName: getItem.uniqueName,
            additional: getItem.additional ? getItem.additional : null
        };
        this._generalService.menuClickedFromOutSideHeader.next(newItem);
    }
}
