#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing mat-app-background for Angular 21...\n');

let stats = {
    filesFixed: 0,
    cssAdded: 0,
    errors: []
};

/**
 * Add mat-app-background CSS class definition to theme files
 */
function addMatAppBackgroundClass() {
    const themeFile = './apps/web-giddh/src/assets/styles/themes/_custom-theme.scss';

    try {
        let content = fs.readFileSync(themeFile, 'utf8');

        // Check if mat-app-background is already defined
        if (content.includes('.mat-app-background')) {
            console.log('✅ mat-app-background class already exists');
            return;
        }

        // Add mat-app-background class definition at the end
        const matAppBackgroundCSS = `
// Angular 21 compatibility: mat-app-background class
// This class was removed in Angular Material 21, so we define it manually
.mat-app-background {
    background-color: var(--mat-app-background-color, var(--mat-sys-surface));
    color: var(--mat-app-text-color, var(--mat-sys-on-surface));
}

// Light theme background
.default-theme .mat-app-background {
    background-color: var(--mat-sys-surface);
    color: var(--mat-sys-on-surface);
}

// Dark theme background
.dark-theme .mat-app-background {
    background-color: var(--mat-sys-surface);
    color: var(--mat-sys-on-surface);
}
`;

        content += matAppBackgroundCSS;

        fs.writeFileSync(themeFile, content);
        console.log('✅ Added mat-app-background class to custom theme');
        stats.cssAdded++;

    } catch (error) {
        console.error('❌ Error updating theme file:', error.message);
        stats.errors.push(`Theme file: ${error.message}`);
    }
}

/**
 * Add fallback CSS variables to material overrides
 */
function addMaterialOverrides() {
    const overrideFile = './apps/web-giddh/src/assets/styles/material/_material-overrides.scss';

    try {
        let content = '';

        // Check if file exists, if not create it
        if (fs.existsSync(overrideFile)) {
            content = fs.readFileSync(overrideFile, 'utf8');
        }

        // Check if mat-app-background overrides already exist
        if (content.includes('mat-app-background')) {
            console.log('✅ Material overrides already exist');
            return;
        }

        const overrideCSS = `
// Angular 21 Material Design 3 compatibility overrides
// Restore mat-app-background functionality

:root {
    --mat-app-background-color: var(--mat-sys-surface, #fefbff);
    --mat-app-text-color: var(--mat-sys-on-surface, #1d1b20);
}

[data-theme="dark"] {
    --mat-app-background-color: var(--mat-sys-surface, #141218);
    --mat-app-text-color: var(--mat-sys-on-surface, #e6e0e9);
}

// Ensure mat-app-background works across all components
.mat-app-background {
    background-color: var(--mat-app-background-color) !important;
    color: var(--mat-app-text-color) !important;
}

// Specific fixes for inventory sidebar
.inventory-aside-pane.mat-app-background {
    background-color: var(--mat-sys-surface-container-low, var(--mat-app-background-color)) !important;
    border-right: 1px solid var(--mat-sys-outline-variant, rgba(0,0,0,0.12));
}

.aside-pane.mat-app-background {
    background-color: var(--mat-sys-surface-container, var(--mat-app-background-color)) !important;
}
`;

        content += overrideCSS;

        fs.writeFileSync(overrideFile, content);
        console.log('✅ Added Material Design 3 overrides');
        stats.cssAdded++;

    } catch (error) {
        console.error('❌ Error updating material overrides:', error.message);
        stats.errors.push(`Material overrides: ${error.message}`);
    }
}

/**
 * Update inventory sidebar component to use proper CSS classes
 */
function updateInventorySidebar() {
    const componentFile = './apps/web-giddh/src/app/new-inventory/component/inventory-sidebar/inventory-sidebar.component.html';

    try {
        let content = fs.readFileSync(componentFile, 'utf8');

        // Remove duplicate mat-app-background class
        content = content.replace(
            'class="aside-pane mat-app-background inventory-aside-pane mat-app-background"',
            'class="aside-pane mat-app-background inventory-aside-pane"'
        );

        fs.writeFileSync(componentFile, content);
        console.log('✅ Fixed duplicate mat-app-background class in inventory sidebar');
        stats.filesFixed++;

    } catch (error) {
        console.error('❌ Error updating inventory sidebar:', error.message);
        stats.errors.push(`Inventory sidebar: ${error.message}`);
    }
}

/**
 * Add component-specific CSS if needed
 */
function addComponentCSS() {
    const componentCSSFile = './apps/web-giddh/src/app/new-inventory/component/inventory-sidebar/inventory-sidebar.component.scss';

    try {
        let content = '';

        // Check if SCSS file exists
        if (fs.existsSync(componentCSSFile)) {
            content = fs.readFileSync(componentCSSFile, 'utf8');
        }

        // Check if mat-app-background styles already exist
        if (content.includes('mat-app-background')) {
            console.log('✅ Component CSS already has mat-app-background styles');
            return;
        }

        const componentCSS = `
// Angular 21 compatibility: Ensure mat-app-background works
:host {
    .mat-app-background {
        background-color: var(--mat-sys-surface, #fefbff);
        color: var(--mat-sys-on-surface, #1d1b20);
    }

    .inventory-aside-pane.mat-app-background {
        background-color: var(--mat-sys-surface-container-low, #f7f2fa);
        border-right: 1px solid var(--mat-sys-outline-variant, #c4c7c5);
    }
}

// Dark theme support
:host-context(.dark-theme) {
    .mat-app-background {
        background-color: var(--mat-sys-surface, #141218);
        color: var(--mat-sys-on-surface, #e6e0e9);
    }

    .inventory-aside-pane.mat-app-background {
        background-color: var(--mat-sys-surface-container-low, #1d1a22);
        border-right: 1px solid var(--mat-sys-outline-variant, #49454f);
    }
}
`;

        content += componentCSS;

        fs.writeFileSync(componentCSSFile, content);
        console.log('✅ Added component-specific mat-app-background styles');
        stats.cssAdded++;

    } catch (error) {
        console.error('❌ Error updating component CSS:', error.message);
        stats.errors.push(`Component CSS: ${error.message}`);
    }
}

/**
 * Main execution
 */
function main() {
    console.log('Step 1: Adding mat-app-background class to theme...');
    addMatAppBackgroundClass();

    console.log('\nStep 2: Adding Material Design 3 overrides...');
    addMaterialOverrides();

    console.log('\nStep 3: Fixing inventory sidebar template...');
    updateInventorySidebar();

    console.log('\nStep 4: Adding component-specific CSS...');
    addComponentCSS();

    console.log('\n📊 Mat-App-Background Fix Results:');
    console.log('==================================');
    console.log(`✅ Files fixed: ${stats.filesFixed}`);
    console.log(`✅ CSS additions: ${stats.cssAdded}`);

    if (stats.errors.length > 0) {
        console.log(`\n❌ Errors: ${stats.errors.length}`);
        stats.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    } else {
        console.log('\n🎉 MAT-APP-BACKGROUND FIXED FOR ANGULAR 21!');
    }

    console.log('\n🚀 Next Steps:');
    console.log('1. Restart development server: npm start');
    console.log('2. Check inventory sidebar background styling');
    console.log('3. Verify theme switching works correctly');

    console.log('\n✨ Angular 21 mat-app-background compatibility complete!');
}

main();
