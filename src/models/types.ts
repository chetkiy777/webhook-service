export type WebhookStatus = "received" | "processing" | "processed" | "failed";

export interface WebhookEvent {
    eventId: string;
    type: string;
    payload: unknown;
    status: WebhookStatus;
    receivedAt: number;
    processedAt?: number;
    error?: string;
}