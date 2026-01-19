/**
 * Model for Tag
 */

export class TagRequest {
    public name: string;
    public description: string;
    public uniqueName?: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.name = '';
        this.description = '';
        this.uniqueName = '';
    }
}
