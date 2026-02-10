import { Router } from 'express';
import { WebhookService } from '../services/WebhookService';
import { store } from '../services/IdempotencyStore';

const router = Router();
const service = new WebhookService();

router.post('/webhooks', async (req, res) => {
    const { eventId, type, payload } = req.body;

    if (!eventId) return res.status(400).send("eventId not found");

    const result = await service.handleIncomingWebhook({ eventId, type, payload });

    if (result.status === 'accepted') {
        return res.status(202).json(result.event);
    }

    return res.status(200).json(result.event);
});

router.get('/webhooks/:eventId', async (req, res) => {
    const event = await store.getEvent(req.params.eventId);
    if (!event) return res.status(404).send("Not found");
    res.json(event);
});


export default router