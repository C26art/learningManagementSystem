import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDatabase from './config/mongodb.js';
import { clerkWebhook, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './config/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
    res.send('API WORKING');
});
app.post('/clerk', express.json(), clerkWebhook);
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

const startServer = async () => {
    await connectDatabase();
    await connectCloudinary();

    app.listen(port, () => {
        console.log(`🚀 Servidor rodando na porta ${port}`);
    });
};

startServer();
