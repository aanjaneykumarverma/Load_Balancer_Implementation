const express = require('express');
const hostController = require('../controllers/hostController');

const router = express.Router();

router
  .route('/')
  .get(hostController.getAllHosts)
  .post(hostController.createHost);

router
  .route('/:id')
  .get(hostController.getHost)
  .patch(hostController.updateHost)
  .delete(hostController.deleteHost);

module.exports = router;
