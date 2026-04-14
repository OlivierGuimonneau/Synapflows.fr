import { Router } from 'express';
import { healthController } from '../controllers/healthController';
import { leadController } from '../controllers/leadController';
import { cspReportController } from '../controllers/cspReportController';
import { leadLimiter } from '../middleware/rateLimit';
const router=Router();router.get('/health',healthController);router.post('/csp-report',cspReportController);router.post('/leads',leadLimiter,leadController);export default router;
