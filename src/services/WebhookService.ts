import { store, WebhookEvent } from './IdempotencyStore';
import { Processor } from './Processor';

export class WebhookService {
    async handleIncomingWebhook(data: { eventId: string; type: string; payload: any }) {
        const lock = store.getLock(data.eventId);

        return await lock.runExclusive(async () => {
            const existing = await store.getEvent(data.eventId);

            if (existing) {
                return { status: 'already_exists', event: existing };
            }

            const newEvent: WebhookEvent = {
                ...data,
                status: 'received',
                receivedAt: Date.now(),
            };

            await store.saveEvent(newEvent);
            this.backgroundProcess(data.eventId);

            return { status: 'accepted', event: newEvent };
        });
    }

    private async backgroundProcess(eventId: string) {
        try {
            await store.updateStatus(eventId, 'processing');

            const event = await store.getEvent(eventId);
            if (!event) {
                console.warn(`[Warning] Event not found in store: ${eventId}`);
                return;
            }

            await Processor.process(event);

            await store.updateStatus(eventId, 'processed', { processedAt: event.processedAt ?? Date.now() });
        } catch (error: any) {
            console.error(`[Error] Processing ${eventId}: ${error?.message}`);
            await store.updateStatus(eventId, 'failed', { error: error?.message });
        }
    }
}
