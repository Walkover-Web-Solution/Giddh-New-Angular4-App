// Type definitions for jQuery Tags Manager
// Project: http://welldonethings.com/tags/manager/v3
// Definitions by: https://github.com/max-favilli
// Definitions: https://github.com/borisyankov/DefinitelyTyped


interface ITagsManagerOptions {
	prefilled?: any[];
	CapitalizeFirstLetter?: boolean;
	preventSubmitOnEnter?: boolean;
	isClearInputOnEsc?: boolean;
	typeahead?: boolean;
	typeaheadAjaxSource?: string;
	typeaheadAjaxPolling?: boolean;
	typeaheadDelegate?: (...args: any[]) => any;
	typeaheadOverrides?: ITypeaheadOverrides;
	typeaheadSource?: any;
	AjaxPush?: string; //url
	AjaxPushAllTags?: string; //url
	AjaxPushParameters: { [key: string]: string; };
	delimiters?: number[];
	backspace?: number[];
	maxTags?: number;
	blinkBGColor_1?: string;
	blinkBGColor_2?: string;
	hiddenTagListName?: string;
	hiddenTagListId?: string;
	deleteTagsOnBackspace?: boolean;
	tagsContainer?: HTMLElement;
	tagCloseIcon?: string;
	tagClass?: string;
	validator: (...args: any[]) => any;
	onlyTagList?: boolean;
}

interface ITypeaheadOverrides {
	instanceSelectHandler?: (...args: any[]) => any;
	selectedClass?: string;
	select?: (...args: any[]) => any;
}

interface ITagsManager {
	tagManagerOptions: ITagsManagerOptions;
	obj: JQuery;
	objName: string;
	queuedTag: string;
	delimiters: number[];
	backspace: number[];
	tagToManipulate: string;

	initialize(context: JQuery,
		options?: ITagsManagerOptions,
		tagToManipulate?: string): void;
	setupTypeahead(): void;
	onTypeaheadAjaxSuccess(data: any, isSetTypeaheadSource: boolean, process?: (...args: any[]) => any): void;
	ajaxPolling(query: string, process: (...args: any[]) => any): void;
	setTypeaheadSource(source: any): void;
	trimTag(tag: string): string;
	popTag(): void;
	empty(): void;
	refreshHiddenTagList(): void;
	spliceTag(tagId: number, eventData: any): void;
	pushTag(tag: string, objToPush: any, isValid: boolean): void;

	setOptions(options: ITagsManagerOptions): void;
	setContext(context: JQuery, tagToManipulate?: string): void;
	processCommand(context: JQuery, command: string, tagToManipulate?: string): JQuery;
	processTags(command?: string, context?: JQuery, tagToManipulate?: string): JQuery;
}

interface JQuery {
	tagsManager(options?: any): JQuery;
	tagsManager(command: string, tagToManipulate?: string): JQuery;
}
