import express from 'express';
import webhookRoutes from './api/routes';

const app = express();
app.use(express.json());


app.use('/', webhookRoutes)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});