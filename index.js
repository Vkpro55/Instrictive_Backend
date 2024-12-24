// DATABASE_URL=postgresql://postgres:p%23A%2DNG%5F9hQ_mvig@db.onilpseoeixitudzjycg.supabase.co:5432/postgres

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

import studentRoute from "./routes/studentRoutes.js"

config();

const app = express();
const prisma = new PrismaClient();


app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('combined'));


app.use("/api/students", studentRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
