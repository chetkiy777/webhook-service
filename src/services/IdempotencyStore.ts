// src/services/IdempotencyStore.ts
import { Mutex } from 'async-mutex';
import type { WebhookEvent, WebhookStatus } from '../models/types';

export class IdempotencyStore {
    private events = new Map<string, WebhookEvent>();
    private locks = new Map<string, Mutex>();

    // Отримати або створити м'ютекс для конкретного eventId
    getLock(eventId: string): Mutex {
        if (!this.locks.has(eventId)) {
            this.locks.set(eventId, new Mutex());
        }
        return this.locks.get(eventId)!;
    }

    async getEvent(eventId: string): Promise<WebhookEvent | undefined> {
        return this.events.get(eventId);
    }

    async saveEvent(event: WebhookEvent): Promise<void> {
        this.events.set(event.eventId, event);
    }

    async updateStatus(eventId: string, status: WebhookStatus, extra: Partial<WebhookEvent> = {}): Promise<void> {
        const event = this.events.get(eventId);
        if (event) {
            this.events.set(eventId, { ...event, status, ...extra });
        }
    }
}

export const store = new IdempotencyStore();

// Переекспорт типів для зручності імпорту з інших модулів
export type { WebhookEvent, WebhookStatus } from '../models/types';
