import { Router } from 'express';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import eventsRoutes from './events.routes.js';
import jobsRoutes from './jobs.routes.js';
import usersRoutes from './users.routes.js';
import jobApplicationsRoutes from './job-applications.routes.js';
import storiesRoutes from './stories.routes.js';
import searchRoutes from './search.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/events', eventsRoutes);
router.use('/jobs', jobsRoutes);              // 👈 IMPORTANT
router.use('/applications', jobApplicationsRoutes);
router.use('/users', usersRoutes);
router.use('/stories', storiesRoutes);
router.use('/search', searchRoutes);

export default router;
