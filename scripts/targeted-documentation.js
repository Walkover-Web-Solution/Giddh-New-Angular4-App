#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
function addDocumentationToFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let enhancedContent = content;
        let additions = 0;
        // Add file header if missing
        if (!content.startsWith('/**') && !content.startsWith('/*')) {
            const fileName = path.basename(filePath);
            const fileHeader = `/**
 * @fileoverview ${generateFileDescription(fileName)}
 * @author Giddh Development Team
 * @since 2026
 */
`;
            enhancedContent = fileHeader + enhancedContent;
            additions++;
        }
        // Add class documentation if missing
        const classPattern = /(?<!\/\*\*[\s\S]*?\*\/\s*)\nexport class (\w+)/g;
        enhancedContent = enhancedContent.replace(classPattern, (match, className) => {
            const classDoc = `
/**
 * ${className} class - Handles ${className.toLowerCase()} functionality
 * @export
 * @class ${className}
 */
${match}`;
            additions++;
            return classDoc;
        });
        if (additions > 0) {
            fs.writeFileSync(filePath, enhancedContent, 'utf8');
            return additions;
        }
        return 0;
    } catch (error) {
        return 0;
    }
}
function generateFileDescription(fileName) {
    const baseName = fileName.replace(/\.(component|service|directive|pipe|guard|interceptor|module)\.ts$/, '');
    const type = fileName.match(/\.(component|service|directive|pipe|guard|interceptor|module)\.ts$/)?.[1] || 'utility';
    const descriptions = {
        component: `${capitalize(baseName)} component for handling user interface and interactions`,
        service: `${capitalize(baseName)} service for business logic and data management`,
        directive: `${capitalize(baseName)} directive for DOM manipulation and behavior`,
        pipe: `${capitalize(baseName)} pipe for data transformation`,
        guard: `${capitalize(baseName)} guard for route protection and access control`,
        interceptor: `${capitalize(baseName)} interceptor for HTTP request/response handling`,
        module: `${capitalize(baseName)} module for feature organization and dependency management`,
        utility: `${capitalize(baseName)} utility functions and helpers`
    };
    return descriptions[type];
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// Process key service files
const keyFiles = [
    'apps/web-giddh/src/app/services/general.service.ts',
    'apps/web-giddh/src/app/services/environment.service.ts',
    'apps/web-giddh/src/app/services/authentication.service.ts',
    'apps/web-giddh/src/app/app.component.ts',
    'apps/web-giddh/src/app/login/login.component.ts',
    'apps/web-giddh/src/app/contact/contact.component.ts'
];
let totalAdditions = 0;
let filesProcessed = 0;
keyFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
        const additions = addDocumentationToFile(fullPath);
        totalAdditions += additions;
        filesProcessed++;
    }
});
