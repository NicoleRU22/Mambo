import express from 'express';

const router = express.Router();

// Placeholder routes for states
router.get('/', (req, res) => {
  res.json({
    message: 'States endpoint',
    data: []
  });
});

export default router;
