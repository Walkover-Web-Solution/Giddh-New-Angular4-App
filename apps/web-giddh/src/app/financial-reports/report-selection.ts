import type { ChildGroup } from '../models/api-models/Search';

export type ReportSelectionNode = Pick<ChildGroup, 'uniqueName' | 'checked'> & {
    childGroups?: readonly ReportSelectionNode[];
    accounts?: readonly ReportSelectionNode[];
};

export interface UncheckedReportSelection {
    uniqueName: ChildGroup['uniqueName'];
    entityType: 'group' | 'account';
    checked: false;
}

/** Append uncheck requests in the existing group-before-account traversal order. */
export function appendUncheckedReportSelections(
    nodes: readonly ReportSelectionNode[],
    entityType: UncheckedReportSelection['entityType'],
    selections: UncheckedReportSelection[]
): void {
    (Array.isArray(nodes) ? nodes : []).forEach((node: ReportSelectionNode) => {
        if (node.checked) {
            selections.push({ uniqueName: node.uniqueName, entityType, checked: false });
        }
        if (node.childGroups?.length) {
            appendUncheckedReportSelections(node.childGroups, 'group', selections);
        }
        if (node.accounts?.length) {
            appendUncheckedReportSelections(node.accounts, 'account', selections);
        }
    });
}
