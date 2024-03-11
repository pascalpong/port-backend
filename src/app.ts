import express from 'express';
import homeRoutes from './routes/homeRoutes';
import authenticationRoutes from './routes/authenticationRoutes';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json()); // This is necessary to parse JSON request bodies

const port = 3000;

app.use('/', homeRoutes);
app.use('/auth', authenticationRoutes);

app.listen(port, async () => {
    console.log('Starting server...');
    try {
        await prisma.$connect();
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.error('Error connecting to the database', error);
    }
});