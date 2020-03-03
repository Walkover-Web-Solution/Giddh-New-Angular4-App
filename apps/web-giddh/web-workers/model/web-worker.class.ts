export class WorkerMessage {
    moduleName: string;
    operationType: string;
    data: any;

    constructor(moduleName: string, operationType: string, data: any) {
        this.moduleName = moduleName;
        this.operationType = operationType;
        this.data = data;
    }

    public static getInstance(data: any): WorkerMessage {
        return new WorkerMessage(data.moduleName, data.operationType, data.data);
    }
}
