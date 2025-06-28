
// 📁 backend/routes/newsletter.routes.ts
import express from 'express';
import { body, param } from 'express-validator';
import {
  subscribeNewsletter,
  getSubscribers,
  unsubscribeNewsletter
} from '../controllers/newsletter.controller';

const router = express.Router();

router.post(
  '/',
  body('name').notEmpty(),
  body('email').isEmail(),
  subscribeNewsletter
);

router.get('/', getSubscribers);
router.delete('/:id', param('id').notEmpty(), unsubscribeNewsletter);

export default router;
