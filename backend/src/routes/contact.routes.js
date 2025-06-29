import express from 'express';
import { getMessages, sendAutoReply } from '../controllers/contact.controller.js';

const router = express.Router();

router.get('/messages', getMessages); // GET http://localhost:4000/api/messages
router.post('/messages/reply/:id', sendAutoReply); // POST http://localhost:4000/api/messages/reply/:id

export default router;
