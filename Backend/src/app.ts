import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth.routes';
import path from 'path';
import cors from 'cors';



const app = express();


const corsOptions = {
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.get('/api/healthcheck', (req, res) => res.status(200).json({ message: 'Server is running' }));
app.use('/api/auth', authRoutes);

// Basic error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;