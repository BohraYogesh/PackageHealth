import { Router } from 'express';
import { analyze } from '../controllers/analysisController.js';
import { validateAnalysis } from '../middleware/validateAnalysis.js';
const router = Router();
router.post('/', validateAnalysis, analyze);
export default router;
