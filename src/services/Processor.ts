import {WebhookEvent} from '../models/types';

export class Processor {
    static async process(event: WebhookEvent): Promise<void> {
        console.log(`[Processor] Starting: ${event.eventId}`);
        event.status = 'processing';

        const delay = Math.floor(Math.random() * 2000) + 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        if (Math.random() < 0.25) {
            event.status = 'failed';
            event.error = 'Random business logic failure';
            event.processedAt = Date.now();
            throw new Error(event.error);
        }

        event.status = 'processed';
        event.processedAt = Date.now();
        console.log(`[Processor] Finished: ${event.eventId}`);
    }
}
