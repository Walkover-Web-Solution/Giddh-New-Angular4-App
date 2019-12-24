/**
 * Model for Tag
 */

export class TagRequest {
    public name: string;
    public description: string;
    public uniqueName?: string;

    constructor() {
        this.name = '';
        this.description = '';
        this.uniqueName = '';
    }
}
