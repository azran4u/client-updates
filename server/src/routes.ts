import express from 'express';

const router = express.Router();

router.get('/health', function (req, res) {
  res.status(200).send('ok');
});

export default router;
