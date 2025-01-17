import { Router } from 'express'
import * as runcodeController from '../controllers/runcode.controller.js'


const router = Router();

router.post('/execute',runcodeController.runCode);

export default router;