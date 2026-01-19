#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Automated JSDoc docstring generator for Angular TypeScript files
 * Adds comprehensive documentation to functions missing docstrings
 */
class DocstringGenerator {
    constructor() {
        this.processedFiles = 0;
        this.functionsDocumented = 0;
        this.functionsSkipped = 0;
        this.errors = 0;
    }

    /**
     * Main entry point to process all files
     * @param {string} directory - Root directory to process
     */
    async processDirectory(directory) {
        console.log(`🚀 Starting docstring generation for: ${directory}`);

        try {
            await this.processDirectoryRecursive(directory);
            this.printSummary();
        } catch (error) {
            console.error('❌ Error processing directory:', error.message);
            this.errors++;
        }
    }

    /**
     * Recursively process all TypeScript files in directory
     * @param {string} dir - Directory to process
     */
    async processDirectoryRecursive(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // Skip node_modules, .git, and other non-source directories
                if (!['node_modules', '.git', 'dist', 'build', '.angular'].includes(entry.name)) {
                    await this.processDirectoryRecursive(fullPath);
                }
            } else if (entry.isFile() && fullPath.endsWith('.ts') && !fullPath.endsWith('.d.ts')) {
                await this.processFile(fullPath);
            }
        }
    }

    /**
     * Process a single TypeScript file
     * @param {string} filePath - Path to the TypeScript file
     */
    async processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const updatedContent = this.addDocstrings(content, filePath);

            if (content !== updatedContent) {
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                this.processedFiles++;
                console.log(`✅ Processed: ${path.relative(process.cwd(), filePath)}`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error.message);
            this.errors++;
        }
    }

    /**
     * Add docstrings to functions missing documentation
     * @param {string} content - File content
     * @param {string} filePath - File path for context
     * @returns {string} Updated content with docstrings
     */
    addDocstrings(content, filePath) {
        const lines = content.split('\n');
        const result = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // Check if this line contains a function that needs documentation
            const functionMatch = this.detectFunction(line, lines, i);

            if (functionMatch && !this.hasExistingDocstring(lines, i)) {
                // Add docstring before the function
                const docstring = this.generateDocstring(functionMatch, filePath);
                const indent = this.getIndentation(line);

                // Add the docstring with proper indentation
                docstring.split('\n').forEach(docLine => {
                    result.push(indent + docLine);
                });

                this.functionsDocumented++;
            } else if (functionMatch) {
                this.functionsSkipped++;
            }

            result.push(line);
            i++;
        }

        return result.join('\n');
    }

    /**
     * Detect if a line contains a function declaration
     * @param {string} line - Current line
     * @param {string[]} lines - All lines in file
     * @param {number} index - Current line index
     * @returns {Object|null} Function match object or null
     */
    detectFunction(line, lines, index) {
        const trimmedLine = line.trim();

        // Skip if line is empty or a comment
        if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
            return null;
        }

        // Patterns for different function types
        const patterns = [
            // Constructor
            /^\s*constructor\s*\(/,
            // Regular function
            /^\s*(?:public|private|protected|static)?\s*(?:async\s+)?(\w+)\s*\(/,
            // Arrow function property
            /^\s*(?:public|private|protected|static)?\s*(\w+)\s*[:=]\s*(?:async\s+)?\(/,
            // Lifecycle methods
            /^\s*(?:public|private|protected)?\s*(ng\w+)\s*\(/,
            // Class declaration
            /^\s*(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/,
            // Interface/Type declaration
            /^\s*(?:export\s+)?(?:interface|type)\s+(\w+)/,
            // Enum declaration
            /^\s*(?:export\s+)?enum\s+(\w+)/,
            // Service/Component decorator followed by class
            /^\s*@(?:Injectable|Component|Directive|Pipe|NgModule)\s*\(/
        ];

        for (const pattern of patterns) {
            const match = trimmedLine.match(pattern);
            if (match) {
                return {
                    type: this.getFunctionType(trimmedLine),
                    name: match[1] || this.extractNameFromLine(trimmedLine),
                    line: trimmedLine,
                    isConstructor: pattern.source.includes('constructor'),
                    isLifecycle: pattern.source.includes('ng\\w+'),
                    isClass: pattern.source.includes('class'),
                    isInterface: pattern.source.includes('interface|type'),
                    isEnum: pattern.source.includes('enum'),
                    isDecorator: pattern.source.includes('@')
                };
            }
        }

        return null;
    }

    /**
     * Extract function name from line when regex capture fails
     * @param {string} line - Line to extract name from
     * @returns {string} Extracted name
     */
    extractNameFromLine(line) {
        // Try to extract class name
        const classMatch = line.match(/class\s+(\w+)/);
        if (classMatch) return classMatch[1];

        // Try to extract interface name
        const interfaceMatch = line.match(/(?:interface|type)\s+(\w+)/);
        if (interfaceMatch) return interfaceMatch[1];

        // Try to extract enum name
        const enumMatch = line.match(/enum\s+(\w+)/);
        if (enumMatch) return enumMatch[1];

        // Try to extract function name
        const funcMatch = line.match(/(\w+)\s*[(:=]/);
        if (funcMatch) return funcMatch[1];

        return 'Unknown';
    }

    /**
     * Determine the type of function/declaration
     * @param {string} line - Line to analyze
     * @returns {string} Function type
     */
    getFunctionType(line) {
        if (line.includes('constructor')) return 'constructor';
        if (line.includes('ngOnInit')) return 'lifecycle';
        if (line.includes('ngOnDestroy')) return 'lifecycle';
        if (line.includes('ngAfterViewInit')) return 'lifecycle';
        if (line.includes('ngOnChanges')) return 'lifecycle';
        if (line.includes('class ')) return 'class';
        if (line.includes('interface ') || line.includes('type ')) return 'interface';
        if (line.includes('enum ')) return 'enum';
        if (line.includes('@')) return 'decorator';
        return 'method';
    }

    /**
     * Check if function already has docstring
     * @param {string[]} lines - All lines in file
     * @param {number} index - Current line index
     * @returns {boolean} True if docstring exists
     */
    hasExistingDocstring(lines, index) {
        // Look backwards for existing docstring
        for (let i = index - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines

            if (line === '*/') {
                // Found end of docstring, look for start
                for (let j = i - 1; j >= 0; j--) {
                    if (lines[j].trim().startsWith('/**')) {
                        return true;
                    }
                }
            }

            // If we hit non-comment content, no docstring exists
            if (!line.startsWith('*') && !line.startsWith('//') && line !== '*/') {
                break;
            }
        }

        return false;
    }

    /**
     * Generate appropriate docstring for function
     * @param {Object} functionMatch - Function match object
     * @param {string} filePath - File path for context
     * @returns {string} Generated docstring
     */
    generateDocstring(functionMatch, filePath) {
        const { type, name, isConstructor, isLifecycle, isClass, isInterface, isEnum } = functionMatch;

        if (isClass) {
            return this.generateClassDocstring(name, filePath);
        } else if (isInterface) {
            return this.generateInterfaceDocstring(name);
        } else if (isEnum) {
            return this.generateEnumDocstring(name);
        } else if (isConstructor) {
            return this.generateConstructorDocstring(filePath);
        } else if (isLifecycle) {
            return this.generateLifecycleDocstring(name);
        } else {
            return this.generateMethodDocstring(name, type, filePath);
        }
    }

    /**
     * Generate docstring for class
     * @param {string} className - Name of the class
     * @param {string} filePath - File path for context
     * @returns {string} Class docstring
     */
    generateClassDocstring(className, filePath) {
        const componentType = this.getComponentType(filePath);
        return `/**
 * ${className} ${componentType}
 * ${this.getClassDescription(className, filePath)}
 */`;
    }

    /**
     * Generate docstring for interface
     * @param {string} interfaceName - Name of the interface
     * @returns {string} Interface docstring
     */
    generateInterfaceDocstring(interfaceName) {
        return `/**
 * ${interfaceName} interface definition
 * Defines the structure and contract for ${interfaceName} objects
 */`;
    }

    /**
     * Generate docstring for enum
     * @param {string} enumName - Name of the enum
     * @returns {string} Enum docstring
     */
    generateEnumDocstring(enumName) {
        return `/**
 * ${enumName} enumeration
 * Defines constant values for ${enumName}
 */`;
    }

    /**
     * Generate docstring for constructor
     * @param {string} filePath - File path for context
     * @returns {string} Constructor docstring
     */
    generateConstructorDocstring(filePath) {
        const componentType = this.getComponentType(filePath);
        return `/**
 * Creates an instance of ${componentType}
 * Initializes component dependencies and sets up initial state
 */`;
    }

    /**
     * Generate docstring for lifecycle method
     * @param {string} methodName - Name of the lifecycle method
     * @returns {string} Lifecycle method docstring
     */
    generateLifecycleDocstring(methodName) {
        const descriptions = {
            'ngOnInit': 'Initializes the component after Angular first displays the data-bound properties',
            'ngOnDestroy': 'Cleanup logic when component is destroyed to prevent memory leaks',
            'ngAfterViewInit': 'Responds after Angular initializes the component\'s views and child views',
            'ngOnChanges': 'Responds when Angular sets or resets data-bound input properties',
            'ngAfterViewChecked': 'Responds after Angular checks the component\'s views and child views',
            'ngAfterContentInit': 'Responds after Angular projects external content into the component\'s view',
            'ngAfterContentChecked': 'Responds after Angular checks the content projected into the component',
            'ngDoCheck': 'Detects and acts upon changes that Angular can\'t or won\'t detect on its own'
        };

        const description = descriptions[methodName] || `${methodName} lifecycle hook implementation`;

        return `/**
 * ${description}
 */`;
    }

    /**
     * Generate docstring for regular method
     * @param {string} methodName - Name of the method
     * @param {string} type - Type of method
     * @param {string} filePath - File path for context
     * @returns {string} Method docstring
     */
    generateMethodDocstring(methodName, type, filePath) {
        const description = this.getMethodDescription(methodName, filePath);

        return `/**
 * ${description}
 */`;
    }

    /**
     * Get component type from file path
     * @param {string} filePath - File path
     * @returns {string} Component type
     */
    getComponentType(filePath) {
        if (filePath.includes('.component.')) return 'component';
        if (filePath.includes('.service.')) return 'service';
        if (filePath.includes('.directive.')) return 'directive';
        if (filePath.includes('.pipe.')) return 'pipe';
        if (filePath.includes('.guard.')) return 'guard';
        if (filePath.includes('.interceptor.')) return 'interceptor';
        if (filePath.includes('.store.')) return 'store';
        if (filePath.includes('.actions.')) return 'actions';
        if (filePath.includes('.reducer.')) return 'reducer';
        if (filePath.includes('.module.')) return 'module';
        return 'class';
    }

    /**
     * Get class description based on name and file path
     * @param {string} className - Name of the class
     * @param {string} filePath - File path for context
     * @returns {string} Class description
     */
    getClassDescription(className, filePath) {
        const componentType = this.getComponentType(filePath);

        if (componentType === 'component') {
            return `Handles ${className.replace('Component', '').toLowerCase()} functionality and user interactions`;
        } else if (componentType === 'service') {
            return `Provides ${className.replace('Service', '').toLowerCase()} related business logic and data operations`;
        } else if (componentType === 'store') {
            return `Manages ${className.replace('Store', '').replace('ComponentStore', '').toLowerCase()} state using NgRx ComponentStore`;
        } else if (componentType === 'actions') {
            return `Defines ${className.replace('Actions', '').toLowerCase()} related action creators for state management`;
        } else if (componentType === 'reducer') {
            return `Handles ${className.replace('Reducer', '').toLowerCase()} state transitions and updates`;
        }

        return `Implements ${className} functionality`;
    }

    /**
     * Get method description based on method name and context
     * @param {string} methodName - Name of the method
     * @param {string} filePath - File path for context
     * @returns {string} Method description
     */
    getMethodDescription(methodName, filePath) {
        // Common method name patterns
        if (methodName.startsWith('get')) {
            return `Retrieves ${methodName.substring(3).toLowerCase()} data`;
        } else if (methodName.startsWith('set')) {
            return `Sets ${methodName.substring(3).toLowerCase()} value`;
        } else if (methodName.startsWith('create')) {
            return `Creates new ${methodName.substring(6).toLowerCase()}`;
        } else if (methodName.startsWith('update')) {
            return `Updates existing ${methodName.substring(6).toLowerCase()}`;
        } else if (methodName.startsWith('delete') || methodName.startsWith('remove')) {
            const prefix = methodName.startsWith('delete') ? 'delete' : 'remove';
            return `Deletes ${methodName.substring(prefix.length).toLowerCase()}`;
        } else if (methodName.startsWith('save')) {
            return `Saves ${methodName.substring(4).toLowerCase()} data`;
        } else if (methodName.startsWith('load')) {
            return `Loads ${methodName.substring(4).toLowerCase()} data`;
        } else if (methodName.startsWith('init')) {
            return `Initializes ${methodName.substring(4).toLowerCase()}`;
        } else if (methodName.startsWith('reset')) {
            return `Resets ${methodName.substring(5).toLowerCase()} to default state`;
        } else if (methodName.startsWith('validate')) {
            return `Validates ${methodName.substring(8).toLowerCase()} input`;
        } else if (methodName.startsWith('calculate')) {
            return `Calculates ${methodName.substring(9).toLowerCase()} value`;
        } else if (methodName.startsWith('handle')) {
            return `Handles ${methodName.substring(6).toLowerCase()} event`;
        } else if (methodName.startsWith('on')) {
            return `Handles ${methodName.substring(2).toLowerCase()} event`;
        } else if (methodName.startsWith('toggle')) {
            return `Toggles ${methodName.substring(6).toLowerCase()} state`;
        } else if (methodName.startsWith('show') || methodName.startsWith('hide')) {
            const action = methodName.startsWith('show') ? 'Shows' : 'Hides';
            const target = methodName.substring(4).toLowerCase();
            return `${action} ${target} element`;
        } else if (methodName.startsWith('open') || methodName.startsWith('close')) {
            const action = methodName.startsWith('open') ? 'Opens' : 'Closes';
            const target = methodName.substring(action.length - 1).toLowerCase();
            return `${action} ${target}`;
        }

        // Default description
        return `Handles ${methodName} functionality`;
    }

    /**
     * Get indentation from line
     * @param {string} line - Line to analyze
     * @returns {string} Indentation string
     */
    getIndentation(line) {
        const match = line.match(/^(\s*)/);
        return match ? match[1] : '';
    }

    /**
     * Print processing summary
     */
    printSummary() {
        console.log('\n📊 DOCSTRING GENERATION SUMMARY:');
        console.log(`✅ Files processed: ${this.processedFiles}`);
        console.log(`📝 Functions documented: ${this.functionsDocumented}`);
        console.log(`⏭️  Functions skipped (already documented): ${this.functionsSkipped}`);
        console.log(`❌ Errors: ${this.errors}`);
        console.log('\n🎉 Docstring generation completed!');
    }
}

// Main execution
if (require.main === module) {
    const generator = new DocstringGenerator();
    const targetDirectory = process.argv[2] || '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App';

    generator.processDirectory(targetDirectory)
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = DocstringGenerator;
