import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth.routes';
import path from 'path';
import cors from 'cors';
import courseRoutes from './routes/course.routes';
import userRoutes from './routes/user.routes'
import resourceRoutes from './routes/resource.routes';
import quizRoutes from './routes/quiz.routes';
import dashboardRoutes from './routes/dashboard.routes';
import mentorRoutes from './routes/mentor.routes';
import certificateRoutes from './routes/certificateRoutes';
import publicRoutes from './routes/public.routes';
import learnerRoutes from './routes/learner.routes';



const app = express();


const corsOptions = {
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '..', 'public')));



app.get('/api/healthcheck', (req, res) => res.status(200).json({ message: 'Server is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/learner', learnerRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;