import { Router } from 'express';
import { searchCsv } from '../controllers/search.controller.js';

const router = Router();

// GET /api/search?q=...&mode=or|and&limit=1000&offset=0
router.get('/', searchCsv);

export default router;
