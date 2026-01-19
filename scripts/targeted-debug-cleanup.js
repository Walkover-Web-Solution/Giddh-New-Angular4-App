#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const filesToClean = [
    'apps/web-giddh/src/app/electron-compatibility.ts',
    'apps/web-giddh/src/app/settings/profile/setting.profile.component.ts',
    'apps/web-giddh/src/app/ledger/components/update-ledger-entry-panel/update-ledger.vm.ts',
    'apps/web-giddh/src/app/contact/contact.component.ts',
    'apps/web-giddh/src/app/signup/signup.component.ts',
    'apps/web-giddh/src/app/shared/directives/resizable.directive.ts',
    'apps/web-giddh/src/app/shared/action-menu/action-menu.component.ts',
    'apps/web-giddh/src/app/shared/primary-sidebar/primary-sidebar.component.ts',
    'apps/web-giddh/src/app/shared/mobile-number-input/geolocation.service.ts',
    'apps/web-giddh/src/app/shared/helpers/directives/enter-next/focusable-click.directive.ts',
    'apps/web-giddh/src/app/shared/header/components/account-add-new-details/account-add-new-details.component.ts',
    'apps/web-giddh/src/app/shared/header/components/account-update-new-details/account-update-new-details.component.ts',
    'apps/web-giddh/src/app/shared/services/dynamic-theme.service.ts',
    'apps/web-giddh/src/app/models/db/db.ts',
    'apps/web-giddh/src/app/version-check.service.ts',
    'apps/web-giddh/src/app/app.component.ts',
    'apps/web-giddh/src/app/theme/ng-social-login-module/auth.service.ts',
    'apps/web-giddh/src/app/theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component.ts',
    'apps/web-giddh/src/app/theme/account-detail-modal/account-detail-modal.component.ts',
    'apps/web-giddh/src/app/financial-reports/components/profit-loss/components/profit-loss-grid/components/profit-loss-grid-row/profit-loss-grid-row.component.ts',
    'apps/web-giddh/src/app/financial-reports/components/grid-row/grid-row.component.ts',
    'apps/web-giddh/src/app/financial-reports/components/balance-sheet/components/balance-sheet-grid/components/balance-sheet-grid-row/balance-sheet-grid-row.component.ts',
    'apps/web-giddh/src/app/actions/login.action.ts',
    'apps/web-giddh/src/app/vouchers/list/list.component.ts',
    'apps/web-giddh/src/app/import-excel/upload-file/upload-file.component.ts',
    'apps/web-giddh/src/app/login/login.component.ts',
    'apps/web-giddh/src/app/services/environment-validator.service.ts',
    'apps/web-giddh/src/app/services/page-leave-utility.service.ts',
    'apps/web-giddh/src/app/services/angular21-change-detection.service.ts',
    'apps/web-giddh/src/app/services/general.service.ts',
    'apps/web-giddh/src/app/services/thermal.service.ts',
    'apps/web-giddh/src/app/services/environment.service.ts',
    'apps/web-giddh/src/app/services/white-label.service.ts',
    'apps/web-giddh/src/app/services/http.interceptor.ts',
    'apps/web-giddh/src/app/angular21-compatibility.ts',
    'apps/web-giddh/src/app/lodash-optimized.ts',
    'apps/web-giddh/src/main.ts'
];
const totalRemovals = 0;
const filesModified = 0;
filesToClean.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
        try {
            const content = fs.readFileSync(fullPath, 'utf8');
            let cleanedContent = content;
            const fileRemovals = 0;
            // Remove console.log statements
            const consolePattern = /^\s*console\.(log|error|warn|info|debug|trace)\s*\([^;]*\);\s*$/gm;
            const matches = cleanedContent.match(consolePattern);
            if (matches) {
                cleanedContent = cleanedContent.replace(consolePattern, '');
                fileRemovals += matches.length;
            }
            // Remove multi-line console statements
            const multiLinePattern = /^\s*console\.(log|error|warn|info|debug|trace)\s*\(\s*[\s\S]*?\);\s*$/gm;
            const multiMatches = cleanedContent.match(multiLinePattern);
            if (multiMatches) {
                cleanedContent = cleanedContent.replace(multiLinePattern, '');
                fileRemovals += multiMatches.length;
            }
            // Clean up empty lines
            cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
            if (fileRemovals > 0) {
                fs.writeFileSync(fullPath, cleanedContent, 'utf8');
                filesModified += 1;
                totalRemovals += fileRemovals;
            }
        } catch (error) {
        }
    }
});
