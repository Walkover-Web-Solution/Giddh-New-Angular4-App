import {AppWorkers} from './app.workers';

export const worker = new AppWorkers(self);
addEventListener('message', (event: MessageEvent) => {
    worker.workerBroker(event);
});
