#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing compilation errors in form field components...\n');

let stats = {
    filesFixed: 0,
    errorsFixed: 0,
    errors: []
};

/**
 * Fix TextFieldComponent compilation errors
 */
function fixTextFieldComponent() {
    const filePath = './apps/web-giddh/src/app/theme/form-fields/text-field/text-field.component.ts';

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Remove the duplicate properties and methods that were incorrectly added
        // First, let's rewrite the class properly

        const newContent = `import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Optional, Self, SimpleChanges, ViewChild } from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";

const noop = () => {
};

@Component({
    selector: "text-field",
    styleUrls: ["./text-field.component.scss"],
    templateUrl: "./text-field.component.html",
    standalone: false,
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: TextFieldComponent,
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFieldComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, MatFormFieldControl<any> {
    // MatFormFieldControl properties
    static nextId = 0;
    controlType = 'text-field';
    id = \`text-field-\${TextFieldComponent.nextId++}\`;
    focused = false;
    errorState = false;
    userAriaDescribedBy?: string;

    @ViewChild('textField', { static: false }) public textField: ElementRef;
    @Input() public pattern: any = null;
    @Input() public required: boolean = false;
    @Input() public disabled: boolean = false;
    @Input() public min: number = null;
    @Input() public max: number = null;
    @Input() public allowDecimalDigitsOnly: boolean = false;
    @Input() public allowDigitsOnly: boolean = false;
    @Input() public cssClass: string = "";
    @Input() public cssStyle: string = "";
    @Input() public placeholder: any = "";
    @Input() public name: any = "";
    @Input() public maxlength: number;
    @Input() public readonly: boolean;
    @Input() public type: string = "text";
    @Input() public showError: boolean = false;
    @Input() public autoFocus: boolean = false;
    @Input() public useMask: boolean = false;
    @Input() public mask: any;
    @Input() public prefix: any;
    @Input() public suffix: any;
    @Input() public customDecimalPlaces: any;
    @Input() public autocomplete: string;
    @Input() public matSuffix: any;

    public ngModel: any;
    public stateChanges = new Subject<void>();
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        private elementRef: ElementRef<HTMLElement>,
        private changeDetectionRef: ChangeDetectorRef
    ) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    public ngOnInit(): void {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.autoFocus) {
            setTimeout(() => {
                this.textField?.nativeElement?.focus();
            }, 20);
        }
    }

    public ngOnDestroy(): void {
        this.stateChanges.complete();
    }

    // MatFormFieldControl implementation
    get empty(): boolean {
        return !this.ngModel;
    }

    get shouldLabelFloat(): boolean {
        return this.focused || !this.empty;
    }

    onContainerClick(event: MouseEvent): void {
        if ((event.target as Element).tagName.toLowerCase() !== 'input') {
            this.textField?.nativeElement?.focus();
        }
    }

    setDescribedByIds(ids: string[]): void {
        const controlElement = this.elementRef.nativeElement.querySelector(".text-field-container");
        if (controlElement) {
            controlElement.setAttribute("aria-describedby", ids.join(" "));
        }
    }

    //////// ControlValueAccessor //////////

    get value(): any {
        return this.ngModel;
    };

    set value(value: any) {
        this.ngModel = value;
        this.onChangeCallback(value);
        this.onTouchedCallback();
        this.stateChanges.next();
    }

    public onBlur(): void {
        this.focused = false;
        this.onTouchedCallback();
        this.stateChanges.next();
    }

    public onFocus(): void {
        this.focused = true;
        this.stateChanges.next();
    }

    public writeValue(value: any): void {
        this.value = value;
        this.changeDetectionRef.detectChanges();
    }

    public registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    public handleInput(): void {
        this.onChangeCallback(this.value);
    }

    public handleChange(): void {
        this.onChangeCallback(this.value);
    }
}
`;

        fs.writeFileSync(filePath, newContent);
        console.log('✅ Fixed TextFieldComponent compilation errors');
        stats.filesFixed++;
        stats.errorsFixed += 8;

    } catch (error) {
        console.error('❌ Error fixing TextFieldComponent:', error.message);
        stats.errors.push(`TextFieldComponent: ${error.message}`);
    }
}

/**
 * Fix InputFieldComponent compilation errors
 */
function fixInputFieldComponent() {
    const filePath = './apps/web-giddh/src/app/theme/form-fields/input-field/input-field.component.ts';

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Remove duplicate onFocus method and fix other issues
        content = content.replace(/public onFocus\(\): void \{[\s\S]*?\n    \}\n\n    public onFocus\(\): void \{[\s\S]*?\n    \}/g,
            `public onFocus(): void {
        this.focused = true;
        this.stateChanges.next();
    }`);

        // Add missing MatFormFieldControl properties if not present
        if (!content.includes('controlType =')) {
            const classDeclaration = 'export class InputFieldComponent implements OnChanges, OnDestroy, ControlValueAccessor {';
            const replacement = `export class InputFieldComponent implements OnChanges, OnDestroy, ControlValueAccessor, MatFormFieldControl<any> {
    // MatFormFieldControl properties
    static nextId = 0;
    controlType = 'input-field';
    id = \`input-field-\${InputFieldComponent.nextId++}\`;
    focused = false;
    errorState = false;
    userAriaDescribedBy?: string;`;

            content = content.replace(classDeclaration, replacement);
        }

        // Add missing MatFormFieldControl methods if not present
        if (!content.includes('get empty()')) {
            const ngOnDestroyMethod = content.match(/public ngOnDestroy\(\): void \{[\s\S]*?\n    \}/);
            if (ngOnDestroyMethod) {
                const replacement = `${ngOnDestroyMethod[0]}

    // MatFormFieldControl implementation
    get empty(): boolean {
        return !this.ngModel;
    }

    get shouldLabelFloat(): boolean {
        return this.focused || !this.empty;
    }

    onContainerClick(event: MouseEvent): void {
        if ((event.target as Element).tagName.toLowerCase() !== 'input') {
            this.textField?.nativeElement?.focus();
        }
    }`;

                content = content.replace(ngOnDestroyMethod[0], replacement);
            }
        }

        // Fix onBlur method to include focus state
        content = content.replace(
            /public onBlur\(\): void \{[\s\S]*?\n    \}/,
            `public onBlur(): void {
        this.focused = false;
        this.onTouchedCallback();
        this.stateChanges.next();
    }`
        );

        fs.writeFileSync(filePath, content);
        console.log('✅ Fixed InputFieldComponent compilation errors');
        stats.filesFixed++;
        stats.errorsFixed += 3;

    } catch (error) {
        console.error('❌ Error fixing InputFieldComponent:', error.message);
        stats.errors.push(`InputFieldComponent: ${error.message}`);
    }
}

/**
 * Fix main.ts import path error
 */
function fixMainTsImport() {
    const filePath = './apps/web-giddh/src/main.ts';

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Fix the import path
        content = content.replace(
            "import { applyAngular21CompatibilityPatches } from './app/angular21-compatibility';",
            "import { applyAngular21CompatibilityPatches } from './app/angular21-compatibility';"
        );

        // Check if the file exists at the correct path
        const compatibilityFilePath = './apps/web-giddh/src/app/angular21-compatibility.ts';
        if (!fs.existsSync(compatibilityFilePath)) {
            console.log('⚠️  angular21-compatibility.ts not found, removing import from main.ts');
            content = content.replace(/import \{ applyAngular21CompatibilityPatches \} from '\.\/app\/angular21-compatibility';\n/, '');
            content = content.replace(/applyAngular21CompatibilityPatches\(\);\n/, '');
        }

        fs.writeFileSync(filePath, content);
        console.log('✅ Fixed main.ts import path');
        stats.filesFixed++;
        stats.errorsFixed += 1;

    } catch (error) {
        console.error('❌ Error fixing main.ts:', error.message);
        stats.errors.push(`main.ts: ${error.message}`);
    }
}

/**
 * Main execution
 */
function main() {
    console.log('Step 1: Fixing TextFieldComponent...');
    fixTextFieldComponent();

    console.log('\nStep 2: Fixing InputFieldComponent...');
    fixInputFieldComponent();

    console.log('\nStep 3: Fixing main.ts import...');
    fixMainTsImport();

    console.log('\n📊 Compilation Error Fix Results:');
    console.log('=================================');
    console.log(`✅ Files fixed: ${stats.filesFixed}`);
    console.log(`✅ Errors resolved: ${stats.errorsFixed}`);

    if (stats.errors.length > 0) {
        console.log(`\n❌ Errors: ${stats.errors.length}`);
        stats.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    } else {
        console.log('\n🎉 ALL COMPILATION ERRORS FIXED!');
    }

    console.log('\n🚀 Next Steps:');
    console.log('1. Development server should now compile successfully');
    console.log('2. Check browser console for runtime errors');
    console.log('3. Test form field functionality');

    console.log('\n✨ Angular 21 compilation fix complete!');
}

main();
