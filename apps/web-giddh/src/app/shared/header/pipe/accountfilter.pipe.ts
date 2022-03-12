import { Pipe, PipeTransform } from '@angular/core';
import { cloneDeep, each, isUndefined } from '../../../lodash-optimized';

@Pipe({
    // tslint:disable-next-line:pipe-naming
    name: 'grpsrch',
    pure: true
})

export class AccountFilterPipe implements PipeTransform {
    public srch: string;

    public transform(input: any, search: string): any {
        input = cloneDeep(input);
        if (!isUndefined(search)) {
            this.srch = search.toLowerCase();
        }

        if (!isUndefined(this.srch)) {
            this.performSearch(input);
            if (this.srch.length < 2) {
                this.resetSearch(input);
            }
        }
        return input;
    }

    public performSearch(input) {
        return each(input, (grp: any) => {
            const grpName = grp.name.toLowerCase();
            const grpUnq = grp.uniqueName.toLowerCase();
            if (!this.checkIndex(grpName, this.srch) && !this.checkIndex(grpUnq, this.srch)) {
                grp.isVisible = false;
                if (grp.groups.length > 0) {
                    return each(grp.groups, (sub: any) => {
                        const subName = sub.name.toLowerCase();
                        const subUnq = sub.uniqueName.toLowerCase();
                        if (!this.checkIndex(subName, this.srch) && !this.checkIndex(subUnq, this.srch)) {
                            sub.isVisible = false;
                            if (sub.groups.length) {
                                return each(sub.groups, (child: any) => {
                                    const childName = child.name.toLowerCase();
                                    const childUnq = child.uniqueName.toLowerCase();
                                    if (!this.checkIndex(childName, this.srch) && !this.checkIndex(childUnq, this.srch)) {
                                        child.isVisible = false;
                                        if (child.groups.length > 0) {
                                            return each(child.groups, (subChild: any) => {
                                                const subChildName = subChild.name.toLowerCase();
                                                const subChildUnq = subChild.uniqueName.toLowerCase();
                                                if (!this.checkIndex(subChildName, this.srch) && !this.checkIndex(subChildUnq, this.srch)) {
                                                    subChild.isVisible = false;
                                                    if (subChild.groups.length > 0) {
                                                        return each(child.groups, (subChild2: any) => {
                                                            const subChild2Name = subChild2.name.toLowerCase();
                                                            const subChild2Unq = subChild2.uniqueName.toLowerCase();
                                                            if (!this.checkIndex(subChild2Name, this.srch) && !this.checkIndex(subChild2Unq, this.srch)) {
                                                                subChild2.isVisible = false;
                                                                if (subChild2.groups.length > 0) {
                                                                    return this.performSearch(subChild.groups);
                                                                }
                                                            } else {
                                                                grp.isVisible = true;
                                                                child.isVisible = true;
                                                                sub.isVisible = true;
                                                                subChild.isVisible = true;
                                                                return subChild2.isVisible = true;
                                                            }
                                                        });
                                                    }
                                                } else {
                                                    grp.isVisible = true;
                                                    child.isVisible = true;
                                                    sub.isVisible = true;
                                                    return subChild.isVisible = true;
                                                }
                                            });
                                        }
                                    } else if (this.checkIndex(childName, this.srch) || this.checkIndex(childUnq, this.srch)) {
                                        grp.isVisible = true;
                                        child.isVisible = true;
                                        return sub.isVisible = true;
                                    }
                                });
                            }
                        } else if (this.checkIndex(subName, this.srch) || this.checkIndex(subUnq, this.srch)) {
                            grp.isVisible = true;
                            return sub.isVisible = true;
                        }
                    });
                }
            } else if (this.checkIndex(grpName, this.srch) || this.checkIndex(grpUnq, this.srch)) {
                return grp.isVisible = true;
            }
        });
    }

    public resetSearch(input) {
        return each(input, (grp: any) => {
            grp.isVisible = true;
            if (grp.groups.length > 0) {
                return each(grp.groups, (sub: any) => {
                    sub.isVisible = true;
                    if (sub.groups.length > 0) {
                        return this.resetSearch(sub.groups);
                    }
                });
            }
        });
    }

    public checkIndex(src, str) {
        if (src.indexOf(str) !== -1) {
            return true;
        } else {
            return false;
        }
    }
}
