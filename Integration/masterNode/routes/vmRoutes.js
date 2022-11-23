const express = require('express');
const vmController = require('../controllers/vmController');

const router = express.Router();

router.route('/').get(vmController.getAllVMs).post(vmController.createVM);

router
  .route('/:id')
  .get(vmController.getVM)
  .patch(vmController.updateVM)
  .delete(vmController.deleteVM);

module.exports = router;
