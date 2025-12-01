import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { listStories, getStory, createStory, updateStory, deleteStory } from '../controllers/stories.controller.js';

const router = Router();

router.get('/', [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 100 })], validate, listStories);
router.get('/:id', [param('id').isMongoId()], validate, getStory);

router.post('/', authRequired, [body('title').notEmpty(), body('content').notEmpty()], validate, createStory);
router.patch('/:id', authRequired, [param('id').isMongoId()], validate, updateStory);
router.delete('/:id', authRequired, [param('id').isMongoId()], validate, deleteStory);

export default router;
