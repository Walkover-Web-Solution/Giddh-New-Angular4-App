#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing controlType errors in Angular 21 custom form controls...\n');

let stats = {
    filesFixed: 0,
    propertiesAdded: 0,
    errors: []
};

/**
 * Fix TextFieldComponent to add missing controlType property
 */
function fixTextFieldComponent() {
    const filePath = './apps/web-giddh/src/app/theme/form-fields/text-field/text-field.component.ts';

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if controlType already exists
        if (content.includes('controlType')) {
            console.log('✅ TextFieldComponent already has controlType property');
            return;
        }

        // Add controlType property after the class declaration
        const classDeclaration = 'export class TextFieldComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {';
        const replacement = `export class TextFieldComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, MatFormFieldControl<any> {
    /** Control type identifier for Angular Material */
    static nextId = 0;
    controlType = 'text-field';
    id = \`text-field-\${TextFieldComponent.nextId++}\`;
    focused = false;
    empty = true;
    shouldLabelFloat = false;
    errorState = false;
    userAriaDescribedBy?: string;`;

        content = content.replace(classDeclaration, replacement);

        // Add required MatFormFieldControl methods
        const ngOnDestroyMethod = `    public ngOnDestroy(): void {
        this.stateChanges.complete();
    }`;

        const additionalMethods = `    public ngOnDestroy(): void {
        this.stateChanges.complete();
    }

    // MatFormFieldControl implementation
    get shouldLabelFloat(): boolean {
        return this.focused || !this.empty;
    }

    get empty(): boolean {
        return !this.ngModel;
    }

    onContainerClick(event: MouseEvent): void {
        if ((event.target as Element).tagName.toLowerCase() !== 'input') {
            this.textField?.nativeElement?.focus();
        }
    }

    setDescribedByIds(ids: string[]): void {
        const controlElement = this.elementRef.nativeElement.querySelector('.text-field-container');
        if (controlElement) {
            controlElement.setAttribute('aria-describedby', ids.join(' '));
        }
    }`;

        content = content.replace(ngOnDestroyMethod, additionalMethods);

        // Update the value setter to handle empty state
        const valueSetter = `    set value(value: any) {
        this.ngModel = value;
        this.empty = !value;
        this.onChangeCallback(value);
        this.onTouchedCallback();
        this.stateChanges.next();
    }`;

        content = content.replace(
            /set value\(value: any\) \{[\s\S]*?\n    \}/,
            valueSetter
        );

        // Add focus and blur handlers
        const onBlurMethod = `    public onBlur(): void {
        this.focused = false;
        this.onTouchedCallback();
        this.stateChanges.next();
    }`;

        content = content.replace(
            /public onBlur\(\): void \{[\s\S]*?\n    \}/,
            onBlurMethod
        );

        // Add onFocus method
        const handleInputMethod = content.match(/public handleInput\(\): void \{[\s\S]*?\n    \}/);
        if (handleInputMethod) {
            const focusMethod = `
    public onFocus(): void {
        this.focused = true;
        this.stateChanges.next();
    }

    ${handleInputMethod[0]}`;

            content = content.replace(handleInputMethod[0], focusMethod);
        }

        fs.writeFileSync(filePath, content);
        console.log('✅ Fixed TextFieldComponent controlType error');
        stats.filesFixed++;
        stats.propertiesAdded += 5;

    } catch (error) {
        console.error('❌ Error fixing TextFieldComponent:', error.message);
        stats.errors.push(`TextFieldComponent: ${error.message}`);
    }
}

/**
 * Fix InputFieldComponent to add missing controlType property
 */
function fixInputFieldComponent() {
    const filePath = './apps/web-giddh/src/app/theme/form-fields/input-field/input-field.component.ts';

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if controlType already exists
        if (content.includes('controlType')) {
            console.log('✅ InputFieldComponent already has controlType property');
            return;
        }

        // Add controlType property after the class declaration
        const classDeclaration = 'export class InputFieldComponent implements OnChanges, OnDestroy, ControlValueAccessor {';
        const replacement = `export class InputFieldComponent implements OnChanges, OnDestroy, ControlValueAccessor, MatFormFieldControl<any> {
    /** Control type identifier for Angular Material */
    static nextId = 0;
    controlType = 'input-field';
    id = \`input-field-\${InputFieldComponent.nextId++}\`;
    focused = false;
    empty = true;
    shouldLabelFloat = false;
    errorState = false;
    userAriaDescribedBy?: string;`;

        content = content.replace(classDeclaration, replacement);

        // Add required MatFormFieldControl methods
        const ngOnDestroyMethod = `    public ngOnDestroy(): void {
        this.stateChanges.complete();
    }`;

        const additionalMethods = `    public ngOnDestroy(): void {
        this.stateChanges.complete();
    }

    // MatFormFieldControl implementation
    get shouldLabelFloat(): boolean {
        return this.focused || !this.empty;
    }

    get empty(): boolean {
        return !this.ngModel;
    }

    onContainerClick(event: MouseEvent): void {
        if ((event.target as Element).tagName.toLowerCase() !== 'input') {
            this.textField?.nativeElement?.focus();
        }
    }

    setDescribedByIds(ids: string[]): void {
        const controlElement = this.elementRef.nativeElement.querySelector('.text-field-container');
        if (controlElement) {
            controlElement.setAttribute('aria-describedby', ids.join(' '));
        }
    }`;

        content = content.replace(ngOnDestroyMethod, additionalMethods);

        // Update the value setter to handle empty state
        const valueSetter = `    set value(value: any) {
        if (value !== undefined && value !== null) {
            this.ngModel = value;
            this.empty = !value;
            this.onChangeCallback(value);
            this.onTouchedCallback();
            this.stateChanges.next();
        }
    }`;

        content = content.replace(
            /set value\(value: any\) \{[\s\S]*?\n    \}/,
            valueSetter
        );

        // Add focus and blur handlers
        const onBlurMethod = `    public onBlur(): void {
        this.focused = false;
        this.onTouchedCallback();
        this.stateChanges.next();
    }`;

        content = content.replace(
            /public onBlur\(\): void \{[\s\S]*?\n    \}/,
            onBlurMethod
        );

        // Add onFocus method before handleInput
        const handleInputMethod = content.match(/public handleInput\(\): void \{[\s\S]*?\n    \}/);
        if (handleInputMethod) {
            const focusMethod = `
    public onFocus(): void {
        this.focused = true;
        this.stateChanges.next();
    }

    ${handleInputMethod[0]}`;

            content = content.replace(handleInputMethod[0], focusMethod);
        }

        fs.writeFileSync(filePath, content);
        console.log('✅ Fixed InputFieldComponent controlType error');
        stats.filesFixed++;
        stats.propertiesAdded += 5;

    } catch (error) {
        console.error('❌ Error fixing InputFieldComponent:', error.message);
        stats.errors.push(`InputFieldComponent: ${error.message}`);
    }
}

/**
 * Search for other custom form field components that might need fixing
 */
function findOtherFormFieldComponents() {
    const searchPaths = [
        './apps/web-giddh/src/app/theme/form-fields',
        './apps/web-giddh/src/app/shared'
    ];

    const foundComponents = [];

    searchPaths.forEach(searchPath => {
        try {
            const files = fs.readdirSync(searchPath, { recursive: true });
            files.forEach(file => {
                if (file.endsWith('.component.ts')) {
                    const filePath = path.join(searchPath, file);
                    try {
                        const content = fs.readFileSync(filePath, 'utf8');
                        if (content.includes('MatFormFieldControl') &&
                            !content.includes('controlType') &&
                            !filePath.includes('text-field') &&
                            !filePath.includes('input-field')) {
                            foundComponents.push(filePath);
                        }
                    } catch (error) {
                        // Skip files we can't read
                    }
                }
            });
        } catch (error) {
            // Skip directories we can't read
        }
    });

    if (foundComponents.length > 0) {
        console.log('\n⚠️  Found additional components that may need controlType fixes:');
        foundComponents.forEach(component => {
            console.log(`   - ${component}`);
        });
    }

    return foundComponents;
}

/**
 * Main execution
 */
function main() {
    console.log('Step 1: Fixing TextFieldComponent...');
    fixTextFieldComponent();

    console.log('\nStep 2: Fixing InputFieldComponent...');
    fixInputFieldComponent();

    console.log('\nStep 3: Searching for other form field components...');
    const otherComponents = findOtherFormFieldComponents();

    console.log('\n📊 ControlType Fix Results:');
    console.log('===========================');
    console.log(`✅ Files fixed: ${stats.filesFixed}`);
    console.log(`✅ Properties added: ${stats.propertiesAdded}`);
    console.log(`⚠️  Additional components found: ${otherComponents.length}`);

    if (stats.errors.length > 0) {
        console.log(`\n❌ Errors: ${stats.errors.length}`);
        stats.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    } else {
        console.log('\n🎉 CONTROLTYPE ERRORS FIXED!');
    }

    console.log('\n🚀 Next Steps:');
    console.log('1. Restart development server to test fixes');
    console.log('2. Check browser console for remaining controlType errors');
    console.log('3. Test form field functionality');

    if (otherComponents.length > 0) {
        console.log('4. Review additional components for similar fixes');
    }

    console.log('\n✨ Angular 21 controlType compatibility complete!');
}

main();
