import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authRequired, requireAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { uploadImage } from '../utils/uploader.js';
import {
  listEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
} from '../controllers/events.controller.js';

const router = Router();

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  listEvents
);

router.get('/:id', [param('id').isMongoId()], validate, getEvent);

router.post(
  '/',
  authRequired,
  requireAdmin,
  uploadImage.single('image'), // image is optional; your admin panel can still send pure JSON
  [
    body('title').notEmpty(),
    body('datetime').isISO8601(),
    body('description').optional({ nullable: true }).isString(),
    body('location').optional({ nullable: true }).isString(),
  ],
  validate,
  createEvent
);

router.patch(
  '/:id',
  authRequired,
  requireAdmin,
  uploadImage.single('image'),
  [param('id').isMongoId()],
  validate,
  updateEvent
);

router.delete(
  '/:id',
  authRequired,
  requireAdmin,
  [param('id').isMongoId()],
  validate,
  deleteEvent
);

router.post(
  '/:id/register',
  authRequired,
  [param('id').isMongoId()],
  validate,
  registerForEvent
);

router.post(
  '/:id/unregister',
  authRequired,
  [param('id').isMongoId()],
  validate,
  unregisterFromEvent
);

export default router;
