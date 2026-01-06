import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth.routes';
import superAdminRoutes from './routes/superAdmin.routes';
import jobRoutes from './routes/job.routes';
import candidateRoutes from './routes/candidate.routes';
import { globalErrorHandler } from './middleware/errorHandler';
import { setupSwagger } from './config/swagger';
import { fileURLToPath } from 'url';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

setupSwagger(app);
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use(globalErrorHandler);

app.use('/api/candidates', candidateRoutes);

export default app;
