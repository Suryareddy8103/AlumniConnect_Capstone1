import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authRequired, requireAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { uploadImage } from '../utils/uploader.js';
import { listUsers, getUser, updateMe, updateUser, deleteUser, connectUser, disconnectUser, changePassword } from '../controllers/users.controller.js';

const router = Router();

router.get(
	'/',
	[
		query('page').optional().isInt({ min: 1 }),
		query('limit').optional().isInt({ min: 1, max: 100 }),
	],
	validate,
	listUsers
);

router.get('/:id', [param('id').isMongoId()], validate, getUser);

router.patch(
	'/me',
	authRequired,
	[
		body('firstName').optional().isString(),
		body('lastName').optional().isString(),
		body('graduationYear').optional().isInt({ min: 1900, max: 3000 }),
		body('degree').optional().isString(),
		body('major').optional().isString(),
		body('location').optional().isString(),
		body('industry').optional().isString(),
		body('company').optional().isString(),
		body('headline').optional().isString(),
		body('bio').optional().isString(),
	],
	validate,
	updateMe
);

router.post('/me/avatar', authRequired, uploadImage.single('avatar'), updateMe);

router.post('/me/password', authRequired, [
	body('currentPassword').isString().isLength({ min: 8 }),
	body('newPassword').isString().isLength({ min: 8 }),
], validate, changePassword);

router.post('/:id/connect', authRequired, [param('id').isMongoId()], validate, connectUser);
router.post('/:id/disconnect', authRequired, [param('id').isMongoId()], validate, disconnectUser);

router.delete('/:id', authRequired, [param('id').isMongoId()], validate, deleteUser);

router.patch('/:id', authRequired, requireAdmin, [param('id').isMongoId(), body('firstName').optional().isString(), body('lastName').optional().isString(), body('graduationYear').optional().isInt({ min: 1900, max: 3000 }), body('degree').optional().isString(), body('major').optional().isString(), body('location').optional().isString(), body('industry').optional().isString(), body('company').optional().isString(),], validate, updateUser);

export default router;
