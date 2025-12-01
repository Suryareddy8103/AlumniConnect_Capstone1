// src/routes/jobs.routes.js
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authRequired, requireAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  listJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
} from '../controllers/jobs.controller.js';

const router = Router();

// List jobs (for jobs page, dashboard, etc.)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('q').optional().isString(),
    query('company').optional().isString(),
    query('location').optional().isString(),
    query('postedBy').optional().isMongoId(),
  ],
  validate,
  listJobs
);

// Get one job by id
router.get(
  '/:id',
  [param('id').isMongoId()],
  validate,
  getJob
);

// Create new job (admin only – used by Add Job in admin dashboard)
router.post(
  '/',
  authRequired,
  requireAdmin,
  [
    body('title').notEmpty(),
    body('description').optional().isString(),
    body('qualifications').optional().isString(),
    body('location').optional().isString(),
    body('company').optional().isString(),
    body('applicationUrl').optional().isString(),
  ],
  validate,
  createJob
);

// Update job (admin only)
router.patch(
  '/:id',
  authRequired,
  requireAdmin,
  [param('id').isMongoId()],
  validate,
  updateJob
);

// Delete job (admin only)
router.delete(
  '/:id',
  authRequired,
  requireAdmin,
  [param('id').isMongoId()],
  validate,
  deleteJob
);

export default router;
