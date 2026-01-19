import { Configuration } from '../../app.constant';

/**
 * Shared utility for ledger navigation in financial reports
 * Used by profit-loss-grid-row and balance-sheet-grid-row components
 */
export class LedgerNavigationHelper {
    /**
     * Opens ledger page in new window/tab with proper Electron handling
     *
     * @param acc Account object with uniqueName
     * @param from From date
     * @param to To date
     * @param currentUrl Current URL for redirect parameter
     */
    public static openLedger(acc: any, from: string, to: string, currentUrl: string): void {
        if (!acc?.uniqueName) return;

        // Construct direct ledger URL with redirectUrl parameter
        let url = `${location.origin}/pages/ledger/${acc.uniqueName}/${from}/${to}`;
        const separator = url.includes('?') ? '&' : '?';
        url = url + `${separator}redirectUrl=${encodeURIComponent(currentUrl)}`;

        if (Configuration.isElectron) {
            try {
                let electronIpcAvailable = false;

                // Try electronAPI first (secure context)
                if ((window as any).electronAPI && (window as any).electronAPI.send) {
                    try {
                        const electronUrl = `${location.origin}${location.pathname}#./pages/ledger/${acc.uniqueName}/${from}/${to}`;
                        (window as any).electronAPI.send('open-url', electronUrl);
                        electronIpcAvailable = true;
                    } catch (ipcError) {

                    }
                }

                // Try legacy electron require (fallback)
                if (!electronIpcAvailable && (window as any).require) {
                    try {
                        const electron = (window as any).require('electron');
                        if (electron && electron.ipcRenderer && electron.ipcRenderer.send) {
                            const electronUrl = `${location.origin}${location.pathname}#./pages/ledger/${acc.uniqueName}/${from}/${to}`;
                            electron.ipcRenderer.send('open-url', electronUrl);
                            electronIpcAvailable = true;
                        }
                    } catch (requireError) {

                    }
                }

                // Fallback to regular window.open if IPC not available
                if (!electronIpcAvailable) {

                    (window as any).open(url, '_blank');
                }
            } catch (error) {

                (window as any).open(url, '_blank');
            }
        } else {
            (window as any).open(url, '_blank');
        }
    }
}
