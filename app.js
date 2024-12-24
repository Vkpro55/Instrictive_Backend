import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import studentRoutes from "./routes/studentRoutes.js"

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('combined'));

app.use('/api/students', studentRoutes);

export default app
