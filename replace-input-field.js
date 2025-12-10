#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to replace input-field with mat-form-field
function replaceInputField(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Simple replacement pattern for basic input-field usage
        const inputFieldRegex = /<input-field\s+([^>]*?)>\s*<\/input-field>/gs;

        content = content.replace(inputFieldRegex, (match, attributes) => {
            modified = true;

            // Extract common attributes
            const typeMatch = attributes.match(/\[type\]="'([^']*)'"/);
            const placeholderMatch = attributes.match(/\[placeholder\]="([^"]*?)"/);
            const nameMatch = attributes.match(/\[?name\]?="'?([^'"]*)'?"/);
            const ngModelMatch = attributes.match(/\[\(ngModel\)\]="([^"]*?)"/);
            const ngModelChangeMatch = attributes.match(/\(ngModelChange\)="([^"]*?)"/);
            const labelMatch = attributes.match(/\[label\]="([^"]*?)"/);
            const maxlengthMatch = attributes.match(/\[?maxlength\]?="'?([^'"]*)'?"/);
            const autocompleteMatch = attributes.match(/\[autocomplete\]="'([^']*)'"/) || attributes.match(/autocomplete="([^"]*)"/);

            const type = typeMatch ? typeMatch[1] : 'text';
            const placeholder = placeholderMatch ? `[placeholder]="${placeholderMatch[1]}"` : '';
            const name = nameMatch ? `name="${nameMatch[1]}"` : '';
            const ngModel = ngModelMatch ? `[(ngModel)]="${ngModelMatch[1]}"` : '';
            const ngModelChange = ngModelChangeMatch ? `(ngModelChange)="${ngModelChangeMatch[1]}"` : '';
            const label = labelMatch ? labelMatch[1] : '';
            const maxlength = maxlengthMatch ? `maxlength="${maxlengthMatch[1]}"` : '';
            const autocomplete = autocompleteMatch ? `autocomplete="${autocompleteMatch[1]}"` : 'autocomplete="off"';

            // Build replacement
            let replacement = `<mat-form-field appearance="outline" floatLabel="always">`;
            if (label) {
                replacement += `\n                        <mat-label>{{ ${label} }}</mat-label>`;
            }
            replacement += `\n                        <input`;
            replacement += `\n                            matInput`;
            replacement += `\n                            type="${type}"`;
            if (placeholder) replacement += `\n                            ${placeholder}`;
            if (name) replacement += `\n                            ${name}`;
            if (ngModel) replacement += `\n                            ${ngModel}`;
            if (ngModelChange) replacement += `\n                            ${ngModelChange}`;
            if (maxlength) replacement += `\n                            ${maxlength}`;
            replacement += `\n                            ${autocomplete}`;
            replacement += `\n                        >`;
            replacement += `\n                    </mat-form-field>`;

            return replacement;
        });

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Replaced input-field in: ${filePath}`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
    return false;
}

// Process the specific file
const targetFile = './apps/web-giddh/src/app/vouchers/template/template-edit-filter/template-edit-filter.component.html';
console.log('🔄 Replacing input-field components with Angular Material equivalents...');

if (replaceInputField(targetFile)) {
    console.log('🎉 Successfully replaced input-field components!');
} else {
    console.log('ℹ️ No input-field components found to replace.');
}
