interface ObjectConstructor {
  assign(target: any, ...sources: any[]): any;
  observe(target: any, callback: Function, acceptList?: Array<any>): void;
}

declare module "angular2/src/dom/browser_adapter" {
  class BrowserDomAdapter {
    static makeCurrent(): void;
    logError(error: any): void;
    attrToPropMap: any;
    query(selector: string): any;
    querySelector(el: any, selector: string): Node;
    querySelectorAll(el: any, selector: string): List<any>;
    on(el: any, evt: any, listener: any): void;
    onAndCancel(el: any, evt: any, listener: any): Function;
    dispatchEvent(el: any, evt: any): void;
    createMouseEvent(eventType: string): MouseEvent;
    createEvent(eventType: any): Event;
    getInnerHTML(el: any): any;
    getOuterHTML(el: any): any;
    nodeName(node: Node): string;
    nodeValue(node: Node): string;
    type(node: HTMLInputElement): string;
    content(node: Node): Node;
    firstChild(el: any): Node;
    nextSibling(el: any): Node;
    parentElement(el: any): any;
    childNodes(el: any): List<Node>;
    childNodesAsList(el: any): List<any>;
    clearNodes(el: any): void;
    appendChild(el: any, node: any): void;
    removeChild(el: any, node: any): void;
    replaceChild(el: Node, newChild: any, oldChild: any): void;
    remove(el: any): any;
    insertBefore(el: any, node: any): void;
    insertAllBefore(el: any, nodes: any): void;
    insertAfter(el: any, node: any): void;
    setInnerHTML(el: any, value: any): void;
    getText(el: any): any;
    setText(el: any, value: string): void;
    getValue(el: any): any;
    setValue(el: any, value: string): void;
    getChecked(el: any): any;
    setChecked(el: any, value: boolean): void;
    createTemplate(html: any): HTMLElement;
    createElement(tagName: any, doc?: Document): HTMLElement;
    createTextNode(text: string, doc?: Document): Text;
    createScriptTag(attrName: string, attrValue: string, doc?: Document): HTMLScriptElement;
    createStyleElement(css: string, doc?: Document): HTMLStyleElement;
    createShadowRoot(el: HTMLElement): DocumentFragment;
    getShadowRoot(el: HTMLElement): DocumentFragment;
    getHost(el: HTMLElement): HTMLElement;
    clone(node: Node): Node;
    hasProperty(element: any, name: string): boolean;
    getElementsByClassName(element: any, name: string): any;
    getElementsByTagName(element: any, name: string): any;
    classList(element: any): List<any>;
    addClass(element: any, classname: string): void;
    removeClass(element: any, classname: string): void;
    hasClass(element: any, classname: string): any;
    setStyle(element: any, stylename: string, stylevalue: string): void;
    removeStyle(element: any, stylename: string): void;
    getStyle(element: any, stylename: string): any;
    tagName(element: any): string;
    attributeMap(element: any): any;
    hasAttribute(element: any, attribute: string): any;
    getAttribute(element: any, attribute: string): any;
    setAttribute(element: any, name: string, value: string): void;
    removeAttribute(element: any, attribute: string): any;
    templateAwareRoot(el: any): any;
    createHtmlDocument(): Document;
    defaultDoc(): Document;
    getBoundingClientRect(el: any): any;
    getTitle(): string;
    setTitle(newTitle: string): void;
    elementMatches(n: any, selector: string): boolean;
    isTemplateElement(el: any): boolean;
    isTextNode(node: Node): boolean;
    isCommentNode(node: Node): boolean;
    isElementNode(node: Node): boolean;
    hasShadowRoot(node: any): boolean;
    isShadowRoot(node: any): boolean;
    importIntoDoc(node: Node): Node;
    isPageRule(rule: any): boolean;
    isStyleRule(rule: any): boolean;
    isMediaRule(rule: any): boolean;
    isKeyframesRule(rule: any): boolean;
    getHref(el: Element): string;
    getEventKey(event: any): string;
    getGlobalEventTarget(target: string): EventTarget;
    getHistory(): History;
    getLocation(): Location;
    getBaseHref(): any;
  }
}

