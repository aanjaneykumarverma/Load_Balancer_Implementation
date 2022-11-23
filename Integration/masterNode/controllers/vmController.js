const VM = require('../models/vmModel');
const factory = require('./handlerFactory');

exports.getAllVMs = factory.getAll(VM);
exports.getVM = factory.getOne(VM);
exports.createVM = factory.createOne(VM);
exports.updateVM = factory.updateOne(VM);
exports.deleteVM = factory.deleteOne(VM);
