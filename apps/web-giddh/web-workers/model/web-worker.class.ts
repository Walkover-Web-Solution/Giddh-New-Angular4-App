export class WorkerMessage {
    /** Module name which uses web worker */
    moduleName: string;
    /** Operation type to be performed by the web worker for a particular module */
    operationType: string;
    /** Data to be operated or the result of any operation */
    data: any;

    /** @ignore */
    constructor(moduleName: string, operationType: string, data: any) {
        this.moduleName = moduleName;
        this.operationType = operationType;
        this.data = data;
    }

    /**
     * Returns the instance of WorkerMessage class based on data received
     *
     * @static
     * @param {*} data Data to be used for instance creation
     * @returns {WorkerMessage} WorkerMessage instance
     * @memberof WorkerMessage
     */
    public static getInstance(data: any): WorkerMessage {
        return new WorkerMessage(data.moduleName, data.operationType, data.data);
    }
}
