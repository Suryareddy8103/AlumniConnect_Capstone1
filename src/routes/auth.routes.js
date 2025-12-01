/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, me, requestPasswordReset } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201:
 *         description: Registered
 */
router.post(
	'/register',
	[
		body('firstName').trim().notEmpty(),
		body('lastName').trim().notEmpty(),
		body('email').isEmail().normalizeEmail(),
		body('password').isLength({ min: 8 }),
	],
	validate,
	register
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Logged in
 */
router.post(
	'/login',
	[
		body('email').isEmail().normalizeEmail(),
		body('password').notEmpty(),
	],
	validate,
	login
);

router.get('/me', authRequired, me);
router.post('/password/reset', [body('email').isEmail().normalizeEmail()], validate, requestPasswordReset);

export default router;
