// 📁 backend/routes/returns.routes.ts
import express from 'express';
import { body, param } from 'express-validator';
import {
  createReturnRequest,
  getAllReturns,
  getReturnById,
  updateReturnStatus,
  deleteReturnRequest
} from '../controllers/returns.controller';

const router = express.Router();

router.post(
  '/',
  body('userId').notEmpty(),
  body('orderItemId').notEmpty(),
  body('reason').notEmpty(),
  createReturnRequest
);

router.get('/', getAllReturns);
router.get('/:id', param('id').notEmpty(), getReturnById);
router.put('/:id', param('id').notEmpty(), updateReturnStatus);
router.delete('/:id', param('id').notEmpty(), deleteReturnRequest);

export default router;