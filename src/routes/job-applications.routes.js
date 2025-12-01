import { Router } from 'express';
import { body, param } from 'express-validator';
import { authRequired, requireAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
	createApplication,
	getApplication,
	getUserApplications,
	getJobApplications,
	updateApplicationStatus,
} from '../controllers/job-applications.controller.js';

const router = Router();

// All routes require authentication
router.use(authRequired);

// Create application for a job
router.post(
	'/jobs/:jobId',
	[param('jobId').isMongoId(), body('coverLetter').optional().isString(), body('resumeUrl').optional().isString()],
	validate,
	createApplication
);

// Get user's applications
router.get('/me', getUserApplications);

// Get specific application
router.get('/:id', [param('id').isMongoId()], validate, getApplication);

// Get all applications for a job (admin or job poster only)
router.get('/jobs/:jobId', [param('jobId').isMongoId()], validate, getJobApplications);

// Update application status (admin or job poster only)
router.patch(
	'/:id',
	[param('id').isMongoId(), body('status').optional().isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted']), body('notes').optional().isString()],
	validate,
	updateApplicationStatus
);

export default router;

